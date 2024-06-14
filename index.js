// 1. Date and Time Custom Web Component
class CurrentDate extends HTMLElement {
  constructor() {
    super()
    this.updateTime()
  }

  connectedCallback() {
    this.intervalId = setInterval(this.updateTime.bind(this), 1000)
  }

  disconnectedCallback() {
    clearInterval(this.intervalId)
  }

  updateTime() {
    const now = new Date()
    const dateString = now.toLocaleDateString()
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })

    this.textContent = `${dateString} ${timeString}`
  }
}

customElements.define("current-date", CurrentDate)

// 2. Header Custom Web Component
class HeaderComponent extends HTMLElement {
  constructor() {
    super()
    const list = document.createElement("ul")
    this.appendChild(list)
  }

  static get observedAttributes() {
    return ["items"]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "items") {
      this.updateItems(JSON.parse(newValue))
    }
  }

  updateItems(items) {
    this.querySelector("ul").innerHTML = items
      .map((item) => `<li><a href="${item.route}">${item.page}</a></li>`)
      .join("")
  }
}

customElements.define("navbar-component", HeaderComponent)

class ModalComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    const template = document.createElement("template")
    template.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <slot name="header"></slot>
          <slot></slot>
          <button class="modal-close">Close</button>
        </div>
      </div>
    `
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.closeButton = this.shadowRoot.querySelector(".modal-close")
    this.closeButton.addEventListener("click", this.closeModal.bind(this))
  }

  connectedCallback() {
    document.body.classList.add("modal-open") // Add class to body for styling
  }

  disconnectedCallback() {
    document.body.classList.remove("modal-open") // Remove class on close
  }

  closeModal() {
    this.remove()
  }

  static get observedAttributes() {
    return ["open"]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open") {
      if (newValue === "true") {
        document.body.appendChild(this)
      } else {
        this.remove()
      }
    }
  }
}

customElements.define("modal-component", ModalComponent)

class TableComponent extends HTMLElement {
  constructor() {
    super()
  }

  static get observedAttributes() {
    return ["data"]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data") {
      this.renderTable(JSON.parse(newValue))
    }
  }

  renderTable(data) {
    this.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `

    const tbody = this.querySelector("tbody")
    data.forEach((item) => {
      const row = document.createElement("tr")
      row.innerHTML = `<td>${item.id}</td><td>${item.name}</td><td>${item.location}</td>`
      tbody.appendChild(row)
    })
  }
}

customElements.define("table-component", TableComponent)

class TooltipComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })

    const tooltipContainer = document.createElement("span")
    tooltipContainer.classList.add("tooltip-container")

    const tooltipText = document.createElement("span")
    tooltipText.classList.add("tooltip-text")
    tooltipText.textContent = this.getAttribute("message")

    const slot = document.createElement("slot")
    tooltipContainer.appendChild(slot)
    tooltipContainer.appendChild(tooltipText)

    const style = document.createElement("style")
    style.textContent = `
            .tooltip-container {
                position: relative;
                display: inline-block;
                cursor: pointer;
            }
            .tooltip-text {
                visibility: hidden;
                background-color: black;
                color: #fff;
                text-align: center;
                border-radius: 5px;
                padding: 5px;
                position: absolute;
                z-index: 1;
                bottom: -90%; /* Position above the text */
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: opacity 0.3s;
            }
            .tooltip-container:hover .tooltip-text {
                visibility: visible;
                opacity: 1;
            }
        `

    this.shadowRoot.append(style, tooltipContainer)
  }
}

customElements.define("tooltip-component", TooltipComponent)
