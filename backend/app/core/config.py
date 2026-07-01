from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    DATABASE_URL: str

    app_name: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    brevo_api_key: str
    sender_email: str
    sender_name: str
    frontend_url: str

    class Config:
        env_file = ".env"

settings = Settings()