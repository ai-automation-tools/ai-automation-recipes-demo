---
title: "Security Toolkit — August 26, 2026"
date: 2026-08-26
type: security-toolkit
site_count: 28
categories: [Identity & Access, Offensive & Recon, Defensive & Detection, OSINT & Investigation, Privacy & Encryption, AppSec & Supply Chain, Cloud & Infra Security, Security AI & Agents]
tags: [security-toolkit, security, identity, iam, osint, appsec, detection, open-source]
model: claude (claude --print, built-in WebSearch)
cover_image_model: codex gpt-image-2
cover_image_prompt: "Abstract geometric composition of nested rectangular perimeters and keyed interlocking forms, stepped boundary frames offset from one another, gated apertures cut through overlapping lattices, some frames aligned and others rotated slightly off-axis to suggest layered protective barriers. Architectural blueprint-inspired flat-plane digital illustration with subtle paper grain texture, precise geometric linework. Palette of graphite grey, signal red, steel blue, and bone white, used in flat blocks and thin outlines. Wide landscape composition, perimeters receding in depth toward a brighter gated aperture near the center, generous negative space at the outer edges, low raking side light casting long hard-edged shadows between the layered frames. Mood: quietly vigilant, controlled tension, deliberate and engineered rather than decorative. STRICT: no text, letters, words, numbers, captions, titles, labels, banners, credits, stat blocks, logos, watermarks, signatures, UI chrome, or borders anywhere in the image. Do not include padlocks, shields, hackers, hoodies, binary code, matrix-style falling characters, fingerprints, keyholes, firewalls, skulls, or any hex-code-like or character-like glyphs."
---

# Security Toolkit — August 26, 2026

> The first run of this stream: 28 tools across identity, offense, defense, OSINT, privacy, AppSec, cloud, and the guardrails now wrapped around AI agents — split between what people already run in production and what shipped in the last few weeks.

## 🔑 Identity & Access

### [Keycloak](https://github.com/keycloak/keycloak)
Open source IdP handling OIDC, SAML, and preview SCIM provisioning, with WebAuthn and MFA policies configured through its admin console. Spin it up with `docker run quay.io/keycloak/keycloak` or a Helm chart — it's the default choice most teams reach for before evaluating anything commercial. Release 26.7.2 shipped August 19, 2026. **Pricing:** free, open source (Apache-2.0); Red Hat sells support separately.

### [OpenBao](https://github.com/openbao/openbao)
When HashiCorp moved Vault to the Business Source License in 2023, this fork picked up the MPL-2.0 codebase and kept building. v2.6.2 landed August 18, 2026, and a February 2026 release added namespaces and HA read scaling that used to be Vault Enterprise-only. It handles secrets, certificates, and encryption keys, and now sits under Linux Foundation governance. Run it via `docker run openbao/openbao` or a Helm chart. **Pricing:** free, open source (MPL-2.0).

### [SimpleWebAuthn](https://github.com/MasterKale/SimpleWebAuthn)
A TypeScript library pair, `@simplewebauthn/server` and `/browser`, that implements passkey registration and authentication so you don't have to read the WebAuthn spec yourself. It's become the standard choice for Node and browser-based passkey flows; `npm install @simplewebauthn/server` gets you started. **Pricing:** free, open source (MIT).

## ⚔️ Offensive & Recon

*Every tool below is for systems you own or are contracted to test.*

### [Metasploit Framework](https://github.com/rapid7/metasploit-framework)
Twenty-three years in, this is still the reference exploitation and post-exploitation framework: a module library, a console, and an RPC API for chaining payloads together. Install via `msfinstall` or apt, then run `msfconsole`. v6.5 added 422 modules over the past two years. **Pricing:** free, open source (3-clause BSD).

### [BloodHound Community Edition](https://github.com/SpecterOps/BloodHound)
Maps Active Directory and Azure attack paths as a graph, so you can see which low-privilege account sits three hops from Domain Admin instead of guessing. Feed it data with the SharpHound or AzureHound collectors, then explore relationships in the CE web UI, backed by Neo4j and Postgres. v9.6.0 shipped August 18, 2026. **Pricing:** free, open source (Apache-2.0); SpecterOps sells a separate commercial Enterprise SaaS.

### [Sliver](https://github.com/BishopFox/sliver)
A Golang command-and-control framework built for red-team exercises, supporting mTLS, WireGuard, HTTP(S), and DNS transports for implant traffic. Run the server binary and generate implants through the CLI client. Bishop Fox keeps it actively maintained even though the last tagged release, v1.7.3, dates to February 2026. **Pricing:** free, open source (GPL-3.0).

### [NetExec](https://github.com/Pennyw0rth/NetExec)
The CrackMapExec successor for enumerating and testing authentication across SMB, WinRM, RDP, LDAP, and MSSQL. `pipx install netexec` or pull the Docker image, then point `nxc` at your scoped protocol and hosts. Commit activity has stayed constant through August 2026. **Pricing:** free, open source (BSD-2-Clause).

## 🛡️ Defensive & Detection

### [Wazuh](https://github.com/wazuh/wazuh)
A SIEM and XDR platform in one: log analysis, file integrity monitoring, vulnerability detection, and an endpoint agent, with nothing held back behind a paid tier. Start with the docker-compose quickstart or the official installer, then roll out agents via package or MSI. v4.14.7 shipped July 30, 2026. **Pricing:** free, open source (GPLv2); Wazuh Inc. sells optional cloud hosting and support.

### [Sigma (SigmaHQ)](https://github.com/SigmaHQ/sigma)
The generic detection-rule format most SIEMs can consume one way or another. Write once, then convert with `pySigma` or `sigma-cli` into queries for Splunk, Elastic, Sentinel, or Wazuh. The July 9, 2026 release added coverage for CVE-2026-41089 alongside 20 new rules and 70 updates. **Pricing:** free; rules ship under the Detection Rule License 1.1, which requires attribution on reproduction rather than a standard MIT/Apache grant.

### [Velociraptor](https://github.com/Velocidex/velociraptor)
Endpoint monitoring and DFIR built on its own query language, VQL, for fleet-wide artifact collection when you need to hunt across hundreds of machines at once. Deploy the server binary, then push the client via MSI, deb, or exe. v0.77.2 landed August 10, 2026 with a CVE fix. Rapid7 acquired the project in 2021 but kept it under AGPL. **Pricing:** free, open source (AGPL-3.0-or-later).

### [T-Pot](https://github.com/telekom-security/tpotce)
Bundles more than 20 honeypots, including LLM-based ones like Beelzebub and Galah, with an Elastic Stack front end so you're not standing up each sensor separately. The installer targets a dedicated Linux host, or you can run the Docker Compose stack. Deutsche Telekom Security's team was still committing fixes as of August 25, 2026, even though the last tagged release predates that. **Pricing:** free, open source (GPL-3.0).

## 🕵️ OSINT & Investigation

### [Sherlock](https://github.com/sherlock-project/sherlock)
Checks a username against 400-plus platforms to see where an account exists, useful for mapping exposure before an assessment. `pipx install sherlock-project` or run it via Docker, then `sherlock <username>`. It's the tool most OSINT lists lead with, and commit activity is current. **Pricing:** free, open source (MIT).

### [OWASP Amass](https://github.com/owasp-amass/amass)
Passive and active reconnaissance for mapping an organization's external attack surface: subdomains, IP ranges, netblocks, ASNs. Grab the Go binary or Docker image and run `amass enum -d <domain>` against infrastructure you own. It's an OWASP flagship project; v5.1.1 shipped April 7, 2026. **Pricing:** free, open source (Apache-2.0); optional paid API integrations (WhoisXML, for example) improve result coverage.

### [ExifTool](https://exiftool.org/)
Reads and strips EXIF, IPTC, XMP, and GPS metadata from thousands of file formats — the standard way to check what a photo or document is quietly carrying before you publish it, or to pull that data during an investigation. `exiftool -gps:all file.jpg` gets you the location fields in one line. Version 13.59 shipped May 27, 2026. **Pricing:** free (dual Artistic-1.0-Perl/GPL license).

## 🔒 Privacy & Encryption

### [Tor Browser](https://www.torproject.org/download/)
Routes traffic through the Tor relay network to resist tracking and censorship — still the reference way to browse anonymously, and still actively shipped. Download the desktop build for Windows, macOS, or Linux, or the Android app, straight from the Tor Project. v15.0.20 shipped August 18, 2026. **Pricing:** free (Tor core is 3-clause BSD; the browser bundles Firefox under MPL-2.0).

### [age](https://github.com/FiloSottile/age)
A file-encryption tool and Go library with small, explicit keys and no config file to get wrong, increasingly the default replacement for `gpg -c` when you just need to encrypt a file to a recipient's public key. Install via your package manager or `go install filippo.io/age/cmd/...@latest`, then `age-keygen` and `age -r <pubkey>`. The 1.3 line added post-quantum support. **Pricing:** free, open source (BSD-3-Clause).

### [SimpleX Chat](https://github.com/simplex-chat/simplex-chat)
An end-to-end encrypted messenger that skips persistent user identifiers entirely: no phone number, no account ID tying messages back to you across the network. Run the mobile apps or the terminal client, and self-host your own SMP relay if you'd rather not rely on the default servers. v7.1.0-beta.1 shipped August 20, 2026. **Pricing:** free, open source (AGPL-3.0).

## 🧩 AppSec & Supply Chain

### [Semgrep](https://github.com/semgrep/semgrep)
A semantic-grep SAST engine covering 30-plus languages with over 2,800 free community rules, fast enough to run on every commit instead of once a quarter. `pip install semgrep`, `brew install semgrep`, or pull the Docker image. The core engine ships under LGPL-2.1; cross-file dataflow, the Pro rule pack, and supply-chain scanning sit behind the paid AppSec Platform. **Pricing:** free open source engine; Platform free up to 10 contributors, then $30/contributor/month.

### [OSV-Scanner](https://github.com/google/osv-scanner)
Google's SCA scanner queries the OSV.dev vulnerability database across 20-plus ecosystems, and the v2 line rewrote the extraction pipeline on OSV-Scalibr, adding guided remediation and container-layer attribution. `go install github.com/google/osv-scanner/v2/cmd/osv-scanner@latest`, then `osv-scanner scan source -r .`. v2.5.0 shipped August 7, 2026. **Pricing:** free, open source (Apache-2.0), no paid tier.

### [Sigstore Cosign](https://github.com/sigstore/cosign)
Signs and verifies container images and other artifacts, keyless or key-based, and anchors them to the Rekor transparency log with in-toto/SLSA attestations. Most of the Sigstore ecosystem builds around it. Install via `brew install cosign` or the `sigstore/cosign-installer` GitHub Action. v3.1.3 shipped August 6, 2026, patching a verification-bypass CVE. **Pricing:** free, open source (Apache-2.0).

### [Socket CLI](https://github.com/SocketDev/socket-cli)
Flags dependency confusion, typosquats, and malicious packages using behavioral analysis instead of matching against known CVEs, which catches supply-chain attacks before a CVE ever gets assigned. `npm install -g @socketsecurity/cli`, then `socket scan create`, or gate installs with `socket npm install`. The CLI is open source; the backing platform is proprietary. **Pricing:** free up to 1,000 scans/month; Team from $25/dev/month.

## ☁️ Cloud & Infra Security

### [Prowler](https://github.com/prowler-cloud/prowler)
Runs hundreds of checks against AWS, Azure, GCP, Kubernetes, and M365 for CIS, PCI-DSS, and SOC2 compliance — the CSPM CLI most teams reach for before paying for a hosted equivalent. `pip install prowler` or `docker run toniblyx/prowler`. v5.39.1 shipped August 18, 2026. **Pricing:** free, open source (Apache-2.0); Prowler Cloud is a separate paid hosted tier.

### [Kubescape](https://github.com/kubescape/kubescape)
A CNCF-incubating platform scanning Kubernetes clusters and manifests for misconfiguration, vulnerabilities, RBAC issues, and runtime drift. Install with the one-line script, Homebrew, or `helm upgrade --install kubescape kubescape/kubescape-operator`. v4.0.12 shipped August 12, 2026, adding concurrent image-scan pipelines and runtime profile drift detection. **Pricing:** free, open source (Apache-2.0); maintainer ARMO sells a commercial management layer.

### [Trivy](https://github.com/aquasecurity/trivy)
One scanner for container images, IaC, SBOM generation, secrets, and misconfiguration, with enough overlap with the rest of this bucket that it's often the only scanner a small team runs. `brew install trivy` or `docker run aquasec/trivy`. v0.74.0 shipped August 14, 2026. Worth knowing: the project suffered a supply-chain compromise in March 2026 that's since been remediated. **Pricing:** free, open source (Apache-2.0); Aqua Security sells a commercial platform built on top.

### [Falco](https://github.com/falcosecurity/falco)
CNCF-graduated runtime security using eBPF or a kernel module to catch abnormal syscalls, privilege escalation, and container escapes as they happen. Deploy as a Kubernetes DaemonSet via Helm, or try the Docker Compose demo first. **Pricing:** free, open source (Apache-2.0); Sysdig, the original creator, sells a commercial platform built on top.

## 🤖 Security AI & Agents

### [NVIDIA Garak](https://github.com/NVIDIA/garak)
Probes an LLM or endpoint with adversarial prompts across 50-plus modules covering jailbreaks, prompt injection, data leakage, toxicity, and hallucination, then scores what comes back. `pip install garak`, then `garak --model_type openai --model_name gpt-4o-mini --probes promptinject`. NVIDIA's AI Red Team has backed it since 2023; v0.16.0 shipped August 4, 2026. **Pricing:** free, open source (Apache-2.0); you pay only for the target model's API calls.

### [Snyk agent-scan](https://github.com/snyk/agent-scan)
Formerly Invariant Labs' mcp-scan, folded into Snyk after the acquisition. It scans installed MCP servers and agent configs for prompt-injection-laden tool descriptions, tool poisoning, and cross-origin tool shadowing, and can run as a proxy to guardrail live MCP traffic. `uvx snyk-agent-scan@latest` gets you the core scanner; a free Snyk account unlocks the rest. v0.6.0 shipped August 19, 2026. **Pricing:** free, open source core (Apache-2.0); deeper features require a Snyk account.

### [NeMo Guardrails](https://github.com/NVIDIA-NeMo/Guardrails)
Defines programmable rails for LLM applications using Colang rules — block jailbreaks, restrict topics, validate input and output before and after a model call. `pip install nemoguardrails`, then write a `config.yml` and rail files. NVIDIA has maintained it since 2023; v0.23.0 shipped July 1, 2026. **Pricing:** free, open source (Apache-2.0).

---

*28 tools this month. Offensive tooling is listed for systems you own or are authorized to test. Found a dead link or have something to add? Reply to the email.*
