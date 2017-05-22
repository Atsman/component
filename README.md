# Component - plain js micro lib. Inspired by backbone view. 

*Education purpose only*

## Installation

`yarn add component`

Component requires babel processing!

## Example - form component

```javascript
import createComponent from 'component';

const FormComponent = createComponent({
  events: {
    'submit .search-form__form': 'onSubmit',
    'change .search-form__input': 'onChange',
  },

  initialize(options) {
    this.state = {};
    this.onSubmitCb = options.onSubmitCb;
    this.render();
  },

  onSubmit(e) {
    e.preventDefault();
    this.onSubmitCb(this.state.query);
  },
  
  onChange(e) {
    this.state.query = e.target.value;
  },

  render() {
    this.el.innerHTML = `
      <div class="search-form">
        <form class="search-form__form">
          <input class="search-form__input" type="text" name="test" value=${this.state.query}>
          <button class="search-form__submit" type="submit">Submit</button>
        </form>
      </div>
    `;
  },
}

const HomePageComponent = createComponent({
  initialize() {
    this.render();
    this.afterRender();
  },
  
  search(query) {
    // do some job here
    console.log(query);
  },
  
  afterRender() {
    this.formSearch = new FormSearchComponent({
      el: '.search-form-container',
      onSubmitCb: this.search.bind(this),
    });
  },
  
  render() {
    this.el.innerHTML = `
      <div class="search-form-container"></div>
    `;
  },
}

new HomePageComponent({
  el: document.body,
});
```
