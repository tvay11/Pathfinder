package pathing.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DirectionsController {

    private final DirectionsService directionsService;

    @Autowired
    public DirectionsController(DirectionsService directionsService) {
        this.directionsService = directionsService;
    }

    @GetMapping("/directions/roundtrip")
    public ResponseEntity<?> getRoundRoute(@RequestParam String origin, @RequestParam List<String> waypoints) {
        try {
            System.out.println("ROUND TRIP");
            Route route = directionsService.getDirectionsRoundTrip(origin, waypoints);

            return ResponseEntity.ok(route);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch directions: " + e.getMessage());
        }
    }

    @GetMapping("/directions/oneway")
    public ResponseEntity<?> getOneWayRoute(@RequestParam String origin, @RequestParam String destination, @RequestParam(required = false) List<String> waypoints) {
        try {

            System.out.println("ONE WAY");

            Route route = directionsService.getDirectionsOneWay(origin, destination, waypoints);

            return ResponseEntity.ok(route);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch directions: " + e.getMessage());
        }
    }
}

class Leg {
    private String startAddress;
    private String endAddress;
    private String distance;
    private String duration;

    public void setStartAddress(String startAddress) {
        this.startAddress = startAddress;
    }

    public void setEndAddress(String endAddress) {
        this.endAddress = endAddress;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getStartAddress() {
        return startAddress;
    }

    public String getEndAddress() {
        return endAddress;
    }

    public String getDistance() {
        return distance;
    }

    public String getDuration() {
        return duration;
    }
}