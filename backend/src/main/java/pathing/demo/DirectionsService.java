package pathing.demo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Service
public class DirectionsService {

    private static final String DIRECTIONS_API_BASE = "https://maps.googleapis.com/maps/api/directions/json";
    private final RestTemplate restTemplate;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public DirectionsService(@Value("${google.maps.api-key}") String apiKey) {
        this.restTemplate = new RestTemplate();
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
    }

    public static String formatWaypoints(List<String> waypoints) {
        StringBuilder coordinatesBuilder = new StringBuilder();
        for (String waypoint : waypoints) {
            coordinatesBuilder.append(waypoint);
        }

        String coordinates = coordinatesBuilder.toString();
        String[] parts = coordinates.split("\\|");
        StringBuilder result = new StringBuilder(parts[0]);

        for (int i = 1; i < parts.length; i++) {
            String[] coords = parts[i].split("-");
            String formattedCoordinate = coords[0] + ", -" + coords[1];
            result.append("|").append(formattedCoordinate);
        }

        return result.toString();
    }

    public Route getDirectionsRoundTrip(String origin, List<String> waypoints) throws IOException {
        String result = waypoints.toString().replace("[", "").replace("]", "");
        URI uri = UriComponentsBuilder.fromHttpUrl(DIRECTIONS_API_BASE)
                .queryParam("origin", origin)
                .queryParam("destination", origin)
                .queryParam("waypoints", "optimize:true|" + result)
                .queryParam("key", apiKey)
                .build()
                .encode()
                .toUri();

        String response = restTemplate.getForObject(uri, String.class);
        return parseDirections(response);
    }

    public Route getDirectionsOneWay(String origin,String destination,  List<String> waypoints) throws IOException {

        if (waypoints != null) {
            String result = waypoints.toString().replace("[", "").replace("]", "");
            System.out.println(result);
            URI uri = UriComponentsBuilder.fromHttpUrl(DIRECTIONS_API_BASE)
                    .queryParam("origin", origin)
                    .queryParam("destination", destination)
                    .queryParam("waypoints", "optimize:true|" + result)
                    .queryParam("key", apiKey)
                    .build()
                    .encode()
                    .toUri();

            String response = restTemplate.getForObject(uri, String.class);
            return parseDirections(response);
        }
        else {
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(DIRECTIONS_API_BASE)
                    .queryParam("origin", origin)
                    .queryParam("destination", destination)
                    .queryParam("key", apiKey);

            URI uri = uriBuilder.build().encode().toUri();

            String response = restTemplate.getForObject(uri, String.class);
            return parseDirections(response);
        }
    }

    private Route parseDirections(String jsonResponse) throws IOException {
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode routesNode = rootNode.path("routes");

        JsonNode routeNode = routesNode.get(0);
        JsonNode legsNode = routeNode.path("legs");

        List<Leg> legs = new ArrayList<>();
        double totalDistance = 0.0;
        double totalDuration = 0.0;

        for (JsonNode legNode : legsNode) {
            Leg leg = new Leg();
            leg.setStartAddress(legNode.path("start_address").asText());
            leg.setEndAddress(legNode.path("end_address").asText());

            double legDistanceMeters = legNode.path("distance").path("value").asDouble();
            String legDistanceMiles = String.format("%.2f mi", legDistanceMeters / 1609.34);
            leg.setDistance(legDistanceMiles);
            totalDistance += legDistanceMeters;

            String legDuration = legNode.path("duration").path("text").asText();
            leg.setDuration(legDuration);
            totalDuration += legNode.path("duration").path("value").asDouble();

            legs.add(leg);
        }

        Route route = new Route();
        route.setLegs(legs);
        route.setTotalDistance(String.format("%.2f mi", totalDistance / 1609.34));
        route.setTotalDuration(String.format(formatDuration(totalDuration)));

        return route;
    }
    private String formatDuration(double totalDurationSeconds) {
        long hours = (long) totalDurationSeconds / 3600;
        long minutes = ((long) totalDurationSeconds % 3600) / 60;
        String formatted = String.format("%d hours %d minutes", hours, minutes);
        return formatted;
    }
}

class Route {
    private List<Leg> legs;
    private String totalDistance;
    private String totalDuration;

    public List<Leg> getLegs() {
        return legs;
    }

    public void setLegs(List<Leg> legs) {
        this.legs = legs;
    }

    public String getTotalDistance() {
        return totalDistance;
    }

    public void setTotalDistance(String totalDistance) {
        this.totalDistance = totalDistance;
    }

    public String getTotalDuration() {
        return totalDuration;
    }

    public void setTotalDuration(String totalDuration) {
        this.totalDuration = totalDuration;
    }
}
