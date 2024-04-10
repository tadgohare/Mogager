from getpass import getpass
import secrets

def create_env_file():
    db_user = input("Enter DB_USER (default: postgres): ") or 'postgres'
    db_host = input("Enter DB_HOST (default: localhost): ") or 'localhost'
    db_pass = getpass("Enter DB_PASS (default: ''): ") or ''
    db_port = input("Enter DB_PORT (default: 5432): ") or '5432'
    jwt_secret = secrets.token_urlsafe(32)

    with open('config/sample.env', 'w') as f:
        f.write(f"DB_USER={db_user}\n")
        f.write(f"DB_HOST={db_host}\n")
        f.write(f"DB_NAME=mogager\n")
        f.write(f"DB_PASS={db_pass}\n")
        f.write(f"DB_PORT={db_port}\n")
        f.write(f"JWT_SECRET={jwt_secret}\n")
    
    print("Successfully created .env file in /config/.env")

if __name__ == "__main__":
    create_env_file()