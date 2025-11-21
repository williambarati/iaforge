from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    elasticsearch_url: str = Field(..., env="ELASTICSEARCH_URL")
    elastic_index: str = Field("ia-usage", env="ELASTIC_INDEX")
    seed_file: Path = Field(Path("/seed/usage.json"), env="SEED_FILE")

    model_config = {
        "env_file": None,
        "case_sensitive": False,
    }


settings = Settings()
