from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    elasticsearch_url: str = Field(..., env="ELASTICSEARCH_URL")
    elasticsearch_user: str | None = Field(None, env="ELASTICSEARCH_USER")
    elasticsearch_password: str | None = Field(None, env="ELASTICSEARCH_PASSWORD")
    elastic_index: str = Field("ia-usage", env="ELASTIC_INDEX")
    port: int = Field(8081, env="PORT")

    model_config = {
        "env_file": None,
        "case_sensitive": False,
    }


settings = Settings()
