import { Component } from '../core';

export class SelectableComponent extends Component {
  readonly type = 'selectable';
  constructor(public isSelected: boolean = false) {
    super();
  }
}

