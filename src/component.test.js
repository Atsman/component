import { expect } from 'chai';
import { Component } from './component';

class TestComponent extends Component {
}

class TestComponentWithEvents extends Component {
  getEvents() {
    return {
      'submit .form': 'onSubmit',
    };
  }

  initialize(options) {
    this.onSubmitCb = options.onSubmitCb;
    this.render();
  }

  onSubmit(e) {
    e.preventDefault();
    this.onSubmitCb(e);
  }

  render() {
    this.el.innerHTML = `
      <form class="form">
        <input type="text" name="test">
        <button class="form__submit" type="submit">Submit</button>
      </form>
    `;
  }
}

class TestComponentWithRender extends Component {
  initialize() {
    this.render();
  }

  render() {
    this.el.innerHTML = `
      <div class="test">Hello Test</div>
    `;
  }
}

describe('Component', () => {
  let testContainer;

  beforeEach(() => {
    testContainer = document.createElement('div');
    testContainer.classList.add('test-component');
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    document.body.removeChild(testContainer);
    testContainer = null;
  });

  it('should find element by selector', () => {
    const component = new TestComponent({
      el: '.test-component',
    });

    expect(component.el).to.be.equal(document.querySelector('.test-component'));
  });

  it('should use provided element', () => {
    const component = new TestComponent({
      el: testContainer,
    });

    expect(component.el).to.be.equal(testContainer);
  });

  it('should create new div element', () => {
    const component = new TestComponent({
    });

    expect(component.el).to.be.instanceof(Element);
  });

  it('should call initialize first', () => {
    const component = new TestComponentWithRender({
      el: '.test-component',
    });

    expect(component.el).to.be.equal(testContainer);
    expect(component.el.innerHTML).to.be.equal(`
      <div class="test">Hello Test</div>
    `);
  });

  it('should bind event', (done) => {
    const component = new TestComponentWithEvents({
      el: '.test-component',
      onSubmitCb: (e) => {
        expect(e).to.be.instanceof(Event);
        done();
      },
    });
    component.el.querySelector('.form__submit').click();
  });
});

