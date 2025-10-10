# Forecast API Request Flow

This diagram shows the flow of a request hitting the SvelteKit API handler at `/api/forecast` and all methods/services it calls along the way.

```mermaid
sequenceDiagram
    autonumber
    actor U as Client
    participant R as SvelteKit Route<br/>/src/routes/api/forecast/+server.ts
    participant D as Domain Service<br/>forecast(lat,long)
    participant GEO as OpenWeatherMap Geo Service<br/>reverseGeolocate(lat,long)
    participant OWM as OpenWeatherMap One Call API<br/>forecast({lat,lon})

    U->>R: GET /api/forecast?lat={lat}&long={long}
    note over R: Parse search params<br/>lat = parseFloat(url.searchParams.get('lat'))<br/>long = parseFloat(url.searchParams.get('long'))
    alt Missing lat/long
        R-->>U: 500 Missing latitude or longitude
    else Valid lat/long
        R->>D: forecast(lat, long)
        activate D
        D->>GEO: reverseGeolocate(lat, long)
        note over GEO: Calls OpenWeatherMap Geocoding API<br/>GET http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={long}&limit=1&appid=$OPEN_WEATHER_MAP_API_KEY
        GEO-->>D: [ { name, state?, country, lat, lon, ... } ]
        note over D: Build locationParts from name, state, and country
        D->>OWM: forecast({ lat, lon: long })
        note over OWM: Calls OpenWeatherMap One Call API 3.0<br/>GET https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&units=metric&exclude=minutely,daily,current&appid=$OPEN_WEATHER_MAP_API_KEY
        OWM-->>D: { hourly: WeatherReport[], ... }
        note over D: Map to domain Forecast
        D-->>R: Forecast DTO
        deactivate D
        R-->>U: 200 application/json
    end
```

Key files and functions referenced:
- API handler: `src/routes/api/forecast/+server.ts`
  - Exports `GET: RequestHandler`
  - Parses `lat` and `long` from query, validates, returns `json(result)`
- Domain forecast: `src/lib/domain/forecast.ts`
  - `forecast(lat: number, long: number)`
  - Calls `reverseGeolocate` then `openWeatherMap.forecast`
- OpenWeatherMap services:
  - `src/lib/openWeatherMap/geolocate.ts`
    - `reverseGeolocate(lat: number, long: number)` → OWM Geocoding API
  - `src/lib/openWeatherMap/forecast.ts`
    - `forecast({ lat, lon })` → OWM One Call 3.0 API with `units=metric`
  - `src/lib/openWeatherMap/index.ts` (barrel exports)
- Environment:
  - Uses `$env/static/private.OPEN_WEATHER_MAP_API_KEY` for both API calls

Error behavior:
- If `lat` or `long` is missing or cannot be parsed to a truthy number, the handler throws `error(500, 'Missing latitude or longitude')`.

Notes:
- Units are hardcoded to `metric` in One Call request (TODO in code mentions allowing selection).
- Reverse geolocation result uses a limit of 1 and builds a human-readable `locationName` from name/state/country.
