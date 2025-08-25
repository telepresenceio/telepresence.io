---
title: telepresence compose publish
description: Publish compose application
hide_table_of_contents: true
---

Publish compose application

### Usage:
```
  telepresence compose publish [flags] [services]
```

### Flags:
```
  -h, --help   help for publish
```

### Compose flags:
```
      --env-file stringArray       Optional environment files
  -f, --file stringArray           Compose configuration files
      --profile stringArray        Profile to enable
      --project-directory string   Specify an alternate working directory (default: the path of the, first specified, Compose file)
      --project-name string        Project name
```

### Compose publish flags:
```
      --oci-version string      OCI image/artifact specification version
      --resolve-image-digests   Pin image tags to digests
      --with-env                Include environment variables in the
  -y, --yes                     Assume "yes" as answer to all prompts
```

### Global Flags:
```
      --output string     Set the output format, supported values are 'json', 'yaml', and 'default' (default "default")
      --progress string   Set type of progress output (auto, tty, plain, json, quiet) (default "auto")
      --use string        Match expression that uniquely identifies the daemon container
```
