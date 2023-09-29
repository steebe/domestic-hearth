- Eventually, change the UI to the following:
  - A fixed-height unordered list of pairs of divs
  - The divs are collapsible, and the behavior is:
    - Distraction is always visible
    - onclick of the Distraction, the Replacement becomes visible
      - The transition should push the items below further in the scrollable view only, and not alter the popup size

Scratch:

HTML:

```html
<ul class="collapsible-list">
  <li>
    <div class="distraction">reddit.com</div>
    <div class="replacement">work.com</div>
  </li>
</ul>

<hr />

<input class="new-distraction" type="text" placeholder="distraction" />
<input
  style="margin-top: 5px;"
  class="new-replacement"
  type="text"
  placeholder="replacement"
/>
```

```css
/* Base styles for the list */
.collapsible-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

/* Header styles */
.collapsible-list .distraction {
  cursor: pointer;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Content styles - initially hidden */
.collapsible-list .replacement {
  display: none;
  padding: 10px;
  border: 1px solid #ddd;
  border-top: none; /* Avoid double border with header */
  border-radius: 0 0 4px 4px;
}

/* Small margin between list items */
.collapsible-list {
  margin-bottom: 10px;
}

.new-override {
  margin-top: 10px;
}
```

```typescript
document
  .querySelectorAll(".collapsible-list .distraction")
  .forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling as HTMLDivElement;
      if (window.getComputedStyle(content).display === "none") {
        content.style.display = "block";
      } else {
        content.style.display = "none";
      }
    });
  });
```
