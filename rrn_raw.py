import random
import math
import json
import os
from collections import defaultdict

class OptimizedRNN:
    def __init__(self, vocab, hidden_size=16, learning_rate=0.1):
        self.vocab = vocab
        self.vocab_size = len(vocab)
        self.hidden_size = hidden_size
        self.lr = learning_rate

        print(f"Initializing RNN: vocab_size={self.vocab_size}, hidden_size={hidden_size}")

        self.char_to_idx = {c: i for i, c in enumerate(vocab)}
        self.idx_to_char = {i: c for i, c in enumerate(vocab)}

        # Pre-allocate and initialize weights more efficiently
        limit = math.sqrt(6.0 / (hidden_size + self.vocab_size))
        self.Wxh = [[random.uniform(-limit, limit) for _ in range(self.vocab_size)] 
                    for _ in range(hidden_size)]
        self.Whh = [[random.uniform(-limit, limit) for _ in range(hidden_size)] 
                    for _ in range(hidden_size)]
        self.Why = [[random.uniform(-limit, limit) for _ in range(hidden_size)] 
                    for _ in range(self.vocab_size)]
        self.bh = [0.0] * hidden_size
        self.by = [0.0] * self.vocab_size

        self.h = [0.0] * hidden_size
        self.h_prev = [0.0] * hidden_size
        
        # Pre-allocate working arrays to avoid repeated allocation
        self._temp_h = [0.0] * hidden_size
        self._temp_y = [0.0] * self.vocab_size
        self._x_onehot = [0.0] * self.vocab_size
        
        # Verify dimensions
        assert len(self.Wxh) == hidden_size, f"Wxh rows: expected {hidden_size}, got {len(self.Wxh)}"
        assert len(self.Wxh[0]) == self.vocab_size, f"Wxh cols: expected {self.vocab_size}, got {len(self.Wxh[0])}"
        assert len(self.Why) == self.vocab_size, f"Why rows: expected {self.vocab_size}, got {len(self.Why)}"
        assert len(self.Why[0]) == hidden_size, f"Why cols: expected {hidden_size}, got {len(self.Why[0])}"

    def forward_fast(self, char_idx):
        """Optimized forward pass with pre-allocated arrays"""
        # Validate input
        if char_idx < 0 or char_idx >= self.vocab_size:
            raise ValueError(f"char_idx {char_idx} out of range [0, {self.vocab_size})")
        
        # Reset one-hot vector efficiently
        for i in range(self.vocab_size):
            self._x_onehot[i] = 0.0
        self._x_onehot[char_idx] = 1.0
        
        # Store previous hidden state
        for i in range(self.hidden_size):
            self.h_prev[i] = self.h[i]
        
        # Hidden layer computation: h = tanh(Wxh @ x + Whh @ h_prev + bh)
        for i in range(self.hidden_size):
            val = self.bh[i]
            # Wxh @ x
            for j in range(self.vocab_size):
                val += self.Wxh[i][j] * self._x_onehot[j]
            # Whh @ h_prev
            for j in range(self.hidden_size):
                val += self.Whh[i][j] * self.h_prev[j]
            self.h[i] = math.tanh(val)
        
        # Output layer: y = Why @ h + by
        for i in range(self.vocab_size):
            val = self.by[i]
            for j in range(self.hidden_size):
                val += self.Why[i][j] * self.h[j]
            self._temp_y[i] = val
        
        # Stable softmax
        max_val = max(self._temp_y)
        exp_sum = 0.0
        for i in range(self.vocab_size):
            self._temp_y[i] = math.exp(self._temp_y[i] - max_val)
            exp_sum += self._temp_y[i]
        
        # Normalize probabilities
        for i in range(self.vocab_size):
            self._temp_y[i] /= exp_sum
            
        return self._temp_y[:]

    def backward_fast(self, target_idx, probs):
        """Optimized backward pass returning gradients"""
        # Output gradients
        dy = probs[:]
        dy[target_idx] -= 1.0
        
        # Gradients for Why and by
        dWhy = [[dy[i] * self.h[j] for j in range(self.hidden_size)] 
                for i in range(self.vocab_size)]
        dby = dy[:]
        
        # Hidden layer gradients
        dh = [0.0] * self.hidden_size
        for i in range(self.hidden_size):
            for j in range(self.vocab_size):
                dh[i] += self.Why[j][i] * dy[j]
        
        # Apply tanh derivative
        dh_raw = [dh[i] * (1.0 - self.h[i] * self.h[i]) for i in range(self.hidden_size)]
        
        # Gradients for Wxh, Whh, bh
        dWxh = [[dh_raw[i] * self._x_onehot[j] for j in range(self.vocab_size)] 
                for i in range(self.hidden_size)]
        dWhh = [[dh_raw[i] * self.h_prev[j] for j in range(self.hidden_size)] 
                for i in range(self.hidden_size)]
        dbh = dh_raw[:]
        
        return dWxh, dWhh, dWhy, dbh, dby

    def clip_gradients(self, grads, max_norm=5.0):
        """Gradient clipping to prevent exploding gradients"""
        total_norm = 0.0
        for grad_matrix in grads:
            if isinstance(grad_matrix[0], list):  # 2D matrix
                for row in grad_matrix:
                    for val in row:
                        total_norm += val * val
            else:  # 1D vector
                for val in grad_matrix:
                    total_norm += val * val
        
        total_norm = math.sqrt(total_norm)
        if total_norm > max_norm:
            scale = max_norm / total_norm
            for grad_matrix in grads:
                if isinstance(grad_matrix[0], list):  # 2D matrix
                    for i, row in enumerate(grad_matrix):
                        for j in range(len(row)):
                            grad_matrix[i][j] *= scale
                else:  # 1D vector
                    for i in range(len(grad_matrix)):
                        grad_matrix[i] *= scale

    def save_weights(self, filename="weights.json"):
        weights = {
            "Wxh": self.Wxh,
            "Whh": self.Whh,
            "Why": self.Why,
            "bh": self.bh,
            "by": self.by
        }
        with open(filename, "w") as f:
            json.dump(weights, f)

    def load_weights(self, filename="weights.json"):
        if not os.path.exists(filename):
            print(f"No weights file found at {filename}, using random initialization")
            return
        
        try:
            with open(filename, "r") as f:
                weights = json.load(f)
            
            # Verify dimensions before loading
            if (len(weights["Wxh"]) != self.hidden_size or 
                len(weights["Wxh"][0]) != self.vocab_size or
                len(weights["Why"]) != self.vocab_size or
                len(weights["Why"][0]) != self.hidden_size):
                print(f"Weight dimensions don't match current model, using random initialization")
                print(f"File: Wxh={len(weights['Wxh'])}x{len(weights['Wxh'][0])}, Why={len(weights['Why'])}x{len(weights['Why'][0])}")
                print(f"Model: Wxh={self.hidden_size}x{self.vocab_size}, Why={self.vocab_size}x{self.hidden_size}")
                return
            
            self.Wxh = weights["Wxh"]
            self.Whh = weights["Whh"]
            self.Why = weights["Why"]
            self.bh = weights["bh"]
            self.by = weights["by"]
            print(f"Loaded weights from {filename}")
            
        except Exception as e:
            print(f"Error loading weights: {e}, using random initialization")

def preprocess_data_fast(text):
    """Optimized data preprocessing"""
    # Remove non-printable characters
    cleaned = []
    for c in text:
        if c.isprintable():
            cleaned.append(c)
    text = ''.join(cleaned)
    
    # Get unique characters more efficiently
    char_set = set()
    for c in text:
        char_set.add(c)
    chars = sorted(char_set)
    
    # Create mapping
    char_to_idx = {c: i for i, c in enumerate(chars)}
    
    # Convert to indices
    data_indices = []
    for c in text:
        if c in char_to_idx:
            data_indices.append(char_to_idx[c])
    
    return chars, data_indices

def train_batch_optimized(model, data_indices, epochs=30, seq_len=20, batch_size=8):
    """Optimized training with mini-batching"""
    n_sequences = len(data_indices) - seq_len - 1
    
    print(f"Training on {n_sequences} sequences...")
    
    # Validate data indices
    max_idx = max(data_indices) if data_indices else 0
    if max_idx >= model.vocab_size:
        print(f"ERROR: Data contains index {max_idx} but vocab size is {model.vocab_size}")
        return
    
    for epoch in range(epochs):
        total_loss = 0.0
        n_batches = 0
        
        # Shuffle training data
        sequence_starts = list(range(0, n_sequences - seq_len, max(1, seq_len // 2)))
        random.shuffle(sequence_starts)
        
        # Process in batches
        for batch_start in range(0, len(sequence_starts), batch_size):
            batch_indices = sequence_starts[batch_start:batch_start + batch_size]
            
            # Accumulate gradients over batch
            batch_dWxh = [[0.0 for _ in range(model.vocab_size)] for _ in range(model.hidden_size)]
            batch_dWhh = [[0.0 for _ in range(model.hidden_size)] for _ in range(model.hidden_size)]
            batch_dWhy = [[0.0 for _ in range(model.hidden_size)] for _ in range(model.vocab_size)]
            batch_dbh = [0.0] * model.hidden_size
            batch_dby = [0.0] * model.vocab_size
            
            batch_loss = 0.0
            valid_sequences = 0
            
            for seq_start in batch_indices:
                if seq_start + seq_len + 1 >= len(data_indices):
                    continue
                
                # Reset hidden state
                model.h = [0.0] * model.hidden_size
                sequence_loss = 0.0
                
                # Forward and backward through sequence
                for t in range(seq_len):
                    input_idx = data_indices[seq_start + t]
                    target_idx = data_indices[seq_start + t + 1]
                    
                    # Validate indices
                    if input_idx >= model.vocab_size or target_idx >= model.vocab_size:
                        print(f"Skipping invalid indices: input={input_idx}, target={target_idx}, vocab_size={model.vocab_size}")
                        continue
                    
                    # Forward pass
                    try:
                        probs = model.forward_fast(input_idx)
                    except Exception as e:
                        print(f"Error in forward pass: {e}")
                        continue
                    
                    # Calculate loss
                    loss = -math.log(probs[target_idx] + 1e-8)
                    sequence_loss += loss
                    
                    # Backward pass
                    try:
                        dWxh, dWhh, dWhy, dbh, dby = model.backward_fast(target_idx, probs)
                    except Exception as e:
                        print(f"Error in backward pass: {e}")
                        continue
                    
                    # Accumulate gradients
                    for i in range(model.hidden_size):
                        for j in range(model.vocab_size):
                            batch_dWxh[i][j] += dWxh[i][j]
                    for i in range(model.hidden_size):
                        for j in range(model.hidden_size):
                            batch_dWhh[i][j] += dWhh[i][j]
                    for i in range(model.vocab_size):
                        for j in range(model.hidden_size):
                            batch_dWhy[i][j] += dWhy[i][j]
                    for i in range(model.hidden_size):
                        batch_dbh[i] += dbh[i]
                    for i in range(model.vocab_size):
                        batch_dby[i] += dby[i]
                
                batch_loss += sequence_loss
                valid_sequences += 1
            
            if valid_sequences == 0:
                continue
            
            # Apply gradient clipping
            model.clip_gradients([batch_dWxh, batch_dWhh, batch_dWhy, batch_dbh, batch_dby])
            
            # Update parameters with averaged gradients
            avg_factor = model.lr / valid_sequences
            for i in range(model.hidden_size):
                for j in range(model.vocab_size):
                    model.Wxh[i][j] -= avg_factor * batch_dWxh[i][j]
            for i in range(model.hidden_size):
                for j in range(model.hidden_size):
                    model.Whh[i][j] -= avg_factor * batch_dWhh[i][j]
            for i in range(model.vocab_size):
                for j in range(model.hidden_size):
                    model.Why[i][j] -= avg_factor * batch_dWhy[i][j]
            for i in range(model.hidden_size):
                model.bh[i] -= avg_factor * batch_dbh[i]
            for i in range(model.vocab_size):
                model.by[i] -= avg_factor * batch_dby[i]
            
            total_loss += batch_loss
            n_batches += 1
        
        avg_loss = total_loss / max(n_batches, 1)
        if epoch % 3 == 0:
            print(f"Epoch {epoch:2d} - Avg Loss: {avg_loss:.4f}")
            
        # Early stopping if loss is too high
        if avg_loss > 100:
            print("Loss too high, stopping training")
            break

def sample_fast(probs, temperature=1.0):
    """Fast sampling with temperature"""
    if temperature != 1.0:
        # Apply temperature
        for i in range(len(probs)):
            probs[i] = math.pow(probs[i] + 1e-8, 1.0 / temperature)
        # Renormalize
        total = sum(probs)
        for i in range(len(probs)):
            probs[i] /= total
    
    # Sample
    r = random.random()
    cumsum = 0.0
    for i, p in enumerate(probs):
        cumsum += p
        if cumsum >= r:
            return i
    return len(probs) - 1

def generate_fast(model, seed="you: hi", max_len=100, temperature=0.8):
    """Fast text generation"""
    print(f"Prompt: '{seed}'")
    
    # Reset and prime with seed
    model.h = [0.0] * model.hidden_size
    
    for char in seed:
        if char in model.char_to_idx:
            char_idx = model.char_to_idx[char]
            model.forward_fast(char_idx)
    
    # Generate text
    output = []
    current_idx = model.char_to_idx.get(seed[-1] if seed else 'a', 0)
    
    for _ in range(max_len):
        probs = model.forward_fast(current_idx)
        next_idx = sample_fast(probs, temperature)
        next_char = model.idx_to_char[next_idx]
        
        if next_char == '\n':
            break
            
        output.append(next_char)
        current_idx = next_idx
    
    result = ''.join(output).strip()
    if not result:
        result = "(no output - try training longer)"
    
    print(f"Generated: '{result}'")
    return result

if __name__ == "__main__":
    # Load data
    try:
        with open("chat.txt", "r", encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        print(f"Loaded {len(lines)} lines from chat.txt")
    except FileNotFoundError:
        print("chat.txt not found. Creating sample data...")
        lines = [
            "you: hi\tHello there!\n",
            "you: how are you?\tI'm doing well, thanks!\n",
            "you: what's up?\tNot much, just chatting!\n",
            "you: bye\tSee you later!\n"
        ] * 10  # Repeat for more training data
    
    # Preprocess
    text = '\n'.join(line.strip() for line in lines if '\t' in line)
    text = text.replace('\t', '\n')
    
    chars, data_indices = preprocess_data_fast(text)
    
    if len(chars) < 2:
        print("Not enough unique characters in data")
        exit()
    
    print(f"Data: {len(data_indices)} chars, Vocab: {len(chars)} unique")
    print(f"Vocabulary: {repr(''.join(chars[:20]))}{'...' if len(chars) > 20 else ''}")
    
    # Create and train model
    model = OptimizedRNN(chars, hidden_size=32, learning_rate=0.05)
    model.load_weights()
    
    print("\nStarting training...")
    train_batch_optimized(model, data_indices, epochs=40, seq_len=15, batch_size=4)
    
    model.save_weights()
    print("\nTraining complete!")
    
    # Generate samples
    print("\n" + "="*50)
    for prompt in ["you: hi", "you: how", "you: what"]:
        generate_fast(model, prompt, max_len=50, temperature=0.7)
        print()
