# Telepresence RESTful API server

Telepresence can run a RESTful API server on the local host, both on the local workstation and in a pod that contains a `traffic-agent`. The server currently has two endpoints. The standard `healthz` endpoint and the `consume-here` endpoint.

## Enabling the server
The server is enabled by setting the `telepresenceAPI.port` to a valid port number in the [Telepresence Helm Chart](https://github.com/telepresenceio/telepresence/tree/release/v2/charts/telepresence). The values may be passed  explicitly to Helm during install, or configured using the [Telepresence Config](../config#restful-api-server) to impact an auto-install.

## Querying the server
On the cluster's side, it's the `traffic-agent` of potentially intercepted pods that runs the server. The server can be accessed using `http://localhost:<TELEPRESENCE_API_PORT>/<some endpoint>` from the application container. Telepresence ensures that the container has the `TELEPRESENCE_API_PORT` environment variable set when the `traffic-agent` is installed. On the workstation, it is the `user-daemon` that runs the server. It uses the `TELEPRESENCE_API_PORT` that is conveyed in the environment of the intercept. This means that the server can be accessed the exact same way locally, provided that the environment is propagated correctly to the interceptor process.

## Endpoints

### healthz
The `http://localhost:<TELEPRESENCE_API_PORT>/healthz` endpoint should respond with status code 200 OK. If it doesn't then something isn't configured correctly. Check that the `traffic-agent` container is present and that the `TELEPRESENCE_API_PORT` has been added to the environment of the application container and/or in the environment that is propagated to the interceptor that runs on the local workstation.

### consume-here
`http://localhost:<TELEPRESENCE_API_PORT>/consume-here` is intended to be queried with a set of headers, typically obtained from a Kafka message or similar, and will respond with "true" (consume the message) or "false" (leave the message on the queue). When running in the cluster, this endpoint will respond with `false` if the headers match an ongoing intercept for the same workload because it's assumed that it's up ot the intercept to consume the message. When running locally, the response is inverted. Matching headers means that the message should be consumed.

The `x-caller-intercept-id: = <TELEPRESENCE_INTERCEPT_ID>` header must always be provided when the call originates from the local workstation. Telepresence needs this to identify the caller correctly. The `<TELEPRESENCE_INTERCEPT_ID>` will be empty when running in the cluster, and it is harmless to provide it there too, so there's no need for conditional code.

#### Example code:

Here's an example filter written in Go. It divides the actual URL creation (only needs to run once) from the filter function to make the filter more performant:
```go
const portEnv = "TELEPRESENCE_API_PORT"
const interceptIdEnv = "TELEPRESENCE_INTERCEPT_ID"

// apiURL creates the generic URL needed to access the service
func apiURL() (string, error) {
	pe := os.Getenv(portEnv)
	if _, err := strconv.ParseUint(pe, 10, 16); err != nil {
		return "", fmt.Errorf("value %q of env %s does not represent a valid port number", pe, portEnv)
	}
	return "http://localhost:" + pe, nil
}

// consumeHereURL creates the URL for the "consume-here" endpoint
func consumeHereURL() (string, error) {
	apiURL, err := apiURL()
	if err != nil {
		return "", err
	}
	return apiURL + "/consume-here", nil
}

// consumeHere expects an url created using consumeHereURL() and calls the endpoint with the given
// headers and returns the result
func consumeHere(url string, hm map[string]string) (bool, error) {
	rq, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return false, err
	}
	rq.Header = make(http.Header, len(hm)+1)
	rq.Header.Set("X-Telepresence-Caller-Intercept-Id", os.Getenv(interceptIdEnv))
	for k, v := range hm {
		rq.Header.Set(k, v)
	}
	rs, err := http.DefaultClient.Do(rq)
	if err != nil {
		return false, err
	}
	defer rs.Body.Close()
	b, err := io.ReadAll(rs.Body)
	if err != nil {
		return false, err
	}
	return strconv.ParseBool(strings.TrimSpace(string(b)))
}
```