param(
  [string]$Origin = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$canonicalOrigin = "https://alpinistiutilitari.ro"
$requestHeaders = if ([Uri]$Origin -and ([Uri]$Origin).Host -in @("localhost", "127.0.0.1")) {
  @{ "x-forwarded-proto" = "https" }
} else {
  @{}
}
$sitemaps = @(
  "/sitemap.xml",
  "/sitemap-main.xml",
  "/sitemap-counties.xml",
  "/sitemap-cities.xml",
  "/sitemap-services.xml",
  "/sitemap-county-service.xml",
  "/sitemap-companies.xml",
  "/sitemap-blog.xml"
)

$urls = [System.Collections.Generic.List[string]]::new()
$summary = foreach ($sitemap in $sitemaps) {
  $response = Invoke-WebRequest -Uri "$Origin$sitemap" -MaximumRedirection 0 -Headers $requestHeaders
  $xml = [xml]$response.Content
  $locations = @(
    $xml.SelectNodes('//*[local-name()="loc"]') |
      ForEach-Object { $_.InnerText }
  )
  $invalidHosts = @(
    $locations |
      Where-Object { $_ -notmatch "^$([regex]::Escape($canonicalOrigin))(?:/|$)" }
  )

  if ($invalidHosts.Count -gt 0) {
    throw "$sitemap contains non-canonical URLs: $($invalidHosts -join ', ')"
  }

  if ($sitemap -ne "/sitemap.xml") {
    foreach ($location in $locations) {
      $urls.Add($location)
    }
  }

  [pscustomobject]@{
    Sitemap = $sitemap
    URLs = $locations.Count
    XML = "valid"
    Host = "canonical"
  }
}

$duplicates = @($urls | Group-Object | Where-Object Count -gt 1)
if ($duplicates.Count -gt 0) {
  throw "Duplicate URLs: $($duplicates.Name -join ', ')"
}

$results = $urls | ForEach-Object -Parallel {
  $publicUrl = $_
  $publicUri = [Uri]$publicUrl
  $localUrl = "$using:Origin$($publicUri.PathAndQuery)"

  try {
    $response = Invoke-WebRequest -Uri $localUrl -MaximumRedirection 0 -TimeoutSec 20 -Headers $using:requestHeaders
    $canonical = [regex]::Match(
      $response.Content,
      '<link[^>]+rel=["'']canonical["''][^>]+href=["'']([^"'']+)["'']',
      "IgnoreCase"
    )
    $title = [regex]::Match($response.Content, '<title>(.*?)</title>', "IgnoreCase")
    $description = [regex]::Match(
      $response.Content,
      '<meta[^>]+name=["'']description["''][^>]+content=["'']([^"'']*)["'']',
      "IgnoreCase"
    )
    $noIndex = $response.Content -match '<meta[^>]+name=["'']robots["''][^>]+content=["''][^"'']*noindex'

    [pscustomobject]@{
      URL = $publicUrl
      Status = [int]$response.StatusCode
      Redirect = $response.Headers.Location -join ""
      NoIndex = $noIndex
      Canonical = if ($canonical.Success) { $canonical.Groups[1].Value } else { "" }
      Title = if ($title.Success) {
        [Net.WebUtility]::HtmlDecode($title.Groups[1].Value.Trim())
      } else {
        ""
      }
      Description = if ($description.Success) {
        [Net.WebUtility]::HtmlDecode($description.Groups[1].Value.Trim())
      } else {
        ""
      }
      Valid = (
        [int]$response.StatusCode -eq 200 -and
        -not $response.Headers.Location -and
        -not $noIndex -and
        $canonical.Success -and
        $canonical.Groups[1].Value.TrimEnd("/") -eq $publicUrl.TrimEnd("/")
      )
    }
  } catch {
    [pscustomobject]@{
      URL = $publicUrl
      Status = 0
      Redirect = ""
      NoIndex = $false
      Canonical = ""
      Title = ""
      Description = ""
      Valid = $false
    }
  }
} -ThrottleLimit 32

$failures = @($results | Where-Object { -not $_.Valid })
$summary | Format-Table -AutoSize
Write-Output "Total public URLs: $($urls.Count)"
Write-Output "Invalid public URLs: $($failures.Count)"

if ($failures.Count -gt 0) {
  $failures | Format-Table -AutoSize
  exit 1
}

$duplicateTitles = @(
  $results |
    Where-Object { $_.Title } |
    Group-Object Title |
    Where-Object Count -gt 1
)
$duplicateDescriptions = @(
  $results |
    Where-Object { $_.Description } |
    Group-Object Description |
    Where-Object Count -gt 1
)

Write-Output "Duplicate titles: $($duplicateTitles.Count)"
Write-Output "Duplicate descriptions: $($duplicateDescriptions.Count)"

if ($duplicateTitles.Count -gt 0 -or $duplicateDescriptions.Count -gt 0) {
  $duplicateTitles | Select-Object Count, Name | Format-Table -AutoSize
  $duplicateDescriptions | Select-Object Count, Name | Format-Table -AutoSize
  exit 1
}

$robots = (Invoke-WebRequest -Uri "$Origin/robots.txt" -Headers $requestHeaders).Content
if ($robots -notmatch '(?m)^Sitemap: https://alpinistiutilitari\.ro/sitemap\.xml\s*$') {
  throw "robots.txt does not contain the canonical sitemap directive."
}

$handler = [System.Net.Http.HttpClientHandler]::new()
$handler.AllowAutoRedirect = $false
$client = [System.Net.Http.HttpClient]::new($handler)
$request = [System.Net.Http.HttpRequestMessage]::new(
  [System.Net.Http.HttpMethod]::Get,
  "$Origin/redirect-test?source=www"
)
$request.Headers.Add("x-forwarded-host", "www.alpinistiutilitari.ro")
$request.Headers.Add("x-forwarded-proto", "https")
$wwwRedirect = $client.Send($request)

if (
  [int]$wwwRedirect.StatusCode -ne 301 -or
  $wwwRedirect.Headers.Location.AbsoluteUri -ne "https://alpinistiutilitari.ro/redirect-test?source=www"
) {
  throw "The www redirect is not a path-preserving HTTP 301."
}

Write-Output "robots.txt: valid"
Write-Output "www redirect: 301, path and query preserved"
