> From: https://chatgpt.com/c/69ef8855-2280-8390-9d1d-81e555095a60

# you asked

/// URL to launch a new issue with pre-populated description
wxString COMMON_CONTROL::m_bugReportUrl =
        wxS( "https://gitlab.com/kicad/code/kicad/-/issues/new?issuable_template=bare&issue"
             "[description]=%s" );  wxString COMMON_CONTROL::m_bugReportUrl = 
        wxS( "http://localhost:3000/api/issues/submit?issuable_template=bare&title=Bug%20Report&issue[description]=%s" );  Why wxLaunchDefaultBrowser failed to launch my localhost one

---

# chatgpt response

`wxLaunchDefaultBrowser` itself is usually not the problem—your URL is.

You’re passing a **non-trivial query string** that contains characters like `[` `]` and likely newlines or `%` from the formatted description. Browsers are strict about URL encoding, and `localhost` URLs tend to fail silently when malformed.

### What’s going wrong

Your original GitLab URL:
```
https://gitlab.com/...&issue[description]=%s
```
works because:
- GitLab tolerates partially encoded query params
- `%s` likely ends up being properly encoded upstream

Your localhost version:
```
http://localhost:3000/api/issues/submit?...&issue[description]=%s
```
fails because:

1. **`[ ]` are not URL-safe**
   - Must be encoded as:
     ```
     issue%5Bdescription%5D
     ```

2. **Your `%s` content is probably not URL-encoded**
   - If it contains spaces, `&`, `=`, or newlines → the URL breaks

3. **wxWidgets does NOT auto-encode**
   - wxWidgets expects a valid URL

---

### Fix (this is the real solution)

#### 1. Encode parameter names
```cpp
"issue%5Bdescription%5D=%s"
```

#### 2. URL-encode the description before formatting

```cpp
wxString encodedDesc = wxURI::Encode(description);

wxString url = wxString::Format(
    "http://localhost:3000/api/issues/submit?"
    "issuable_template=bare&title=Bug%%20Report&issue%%5Bdescription%%5D=%s",
    encodedDesc
);
```

⚠️ Note:
- `%%` is needed inside `Format`
- `wxURI::Encode` is critical

---

### 3. Full working version

```cpp
wxString encodedDesc = wxURI::Encode(description);

wxString url = wxString::Format(
    "http://localhost:3000/api/issues/submit?"
    "issuable_template=bare&title=Bug%%20Report&issue%%5Bdescription%%5D=%s",
    encodedDesc
);

wxLaunchDefaultBrowser(url);
```

---

### Additional gotchas (worth checking)

- Your local server (`localhost:3000`) must actually be running
- If it's a POST endpoint → browser launch won’t work
  - Browsers open GET URLs only
- If your API expects JSON body → this approach will **never work**

---

### Key insight

If your `/api/issues/submit` endpoint is **POST-only**, then:

> `wxLaunchDefaultBrowser` is the wrong tool.

You either:
- Switch to a **GET-based redirect endpoint**, or
- Use `wxHTTP` / `libcurl` to POST instead

---

If you want, I can help you redesign this so:
- guest issues open in browser
- but still get cached + reviewed before GitLab submission (your earlier requirement)