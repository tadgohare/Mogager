import os
from getpass import getpass

def create_env_file():
    db_user = input("Enter DB_USER (default: postgres): ") or 'postgres'
    db_host = input("Enter DB_HOST (default: localhost): ") or 'localhost'
    # db_name = input("Enter DB_NAME: ")
    db_pass = getpass("Enter DB_PASS (default: ''): ") or ''
    db_port = input("Enter DB_PORT (default: 5432): ") or '5432'

    with open('config/sample.env', 'w') as f:
        f.write(f"DB_USER={db_user}\n")
        f.write(f"DB_HOST={db_host}\n")
        f.write(f"DB_NAME=mogager\n")
        f.write(f"DB_PASS={db_pass}\n")
        f.write(f"DB_PORT={db_port}\n")

if __name__ == "__main__":
    create_env_file()