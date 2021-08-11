from Crypto.Hash import SHA256

def sha256(raw: str):
    hash = SHA256.new()
    hash.update(raw.encode("utf-8"))
    return hash.hexdigest()