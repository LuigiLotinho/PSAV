# Beispiele

## HTMX Form Submit

```html
<form hx-post="/profile" hx-target="#profile-result" hx-swap="outerHTML">
  <div class="mb-3">
    <label class="form-label" for="display_name">Anzeigename</label>
    <input class="form-control" id="display_name" name="display_name" type="text" required>
  </div>
  <button class="btn btn-primary" type="submit">Speichern</button>
</form>

<div id="profile-result"></div>
```

## HTMX Modal Pattern

```html
<button
  class="btn btn-secondary"
  data-bs-toggle="modal"
  data-bs-target="#editModal"
  hx-get="/items/42/edit"
  hx-target="#editModal .modal-body"
  hx-trigger="click">
  Bearbeiten
</button>

<div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Eintrag bearbeiten</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen"></button>
      </div>
      <div class="modal-body">
        <!-- HTMX lädt das Formular hier hinein -->
      </div>
    </div>
  </div>
</div>
```

## Bootstrap Layout (Grid + Card)

```html
<div class="container my-4">
  <div class="row g-3">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">Karte A</h5>
          <p class="card-text">Kurzer Inhalt.</p>
          <a class="btn btn-outline-primary" href="/items/1">Öffnen</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Inline-Validierung mit hx-target

```html
<div class="mb-3">
  <label class="form-label" for="email">E-Mail</label>
  <input
    class="form-control"
    id="email"
    name="email"
    type="email"
    hx-post="/validate/email"
    hx-trigger="blur"
    hx-target="#email-feedback"
    hx-swap="innerHTML">
  <div id="email-feedback" class="invalid-feedback"></div>
</div>
```
