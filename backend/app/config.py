from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Interview Mirror"
    api_prefix: str = "/api/v1"
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "interview_mirror"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: str = "change-me"
    jwt_expire_minutes: int = 30
    github_client_id: str = ""
    github_client_secret: str = ""
    cors_origins: list[str] = ["http://localhost:5173"]
    max_resume_mb: int = 5


settings = Settings()
