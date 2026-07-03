from pydantic import BaseModel


class SpotifyWidgetData(BaseModel):
    track: str
    artist: str
    album: str
    progress_sec: int
    duration_sec: int
    is_playing: bool
    # Whether this is real synced data (True) or the demo fallback (False).
    is_live: bool = False


class ConnectionStatus(BaseModel):
    provider: str
    connected: bool
