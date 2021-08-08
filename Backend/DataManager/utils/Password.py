from Crypto.Hash import SHA256

def sha256(raw):
    hash = SHA256.new()
    hash.update(raw)
    return hash.hexdigest()