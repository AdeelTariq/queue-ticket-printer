import React, { Component } from 'react';
import $ from 'jquery';
import './App.css';
import Ticket from './components/Ticket'
import Toast from './components/Toast';
const electronRemote = window.require('electron').remote;
const {Menu, MenuItem} = electronRemote;
const Store = electronRemote.require('electron-store');
const store = new Store();
const MAX_NUMBER = 9999;
const menu = new Menu ();

export default class App extends Component {

  constructor () {
    super();
    this.state = {
      number: store.get('number') === undefined ? 1 : store.get('number'),
      selectedPrinter: {name: 'Printers'},
      printers: [],
      error: "",
    }

    menu.append (new MenuItem ({role: 'appMenu'}));
    menu.append (new MenuItem ({role: 'fileMenu'}));
    
    var submenu = new Menu ();
    submenu.append (new MenuItem({
      label: 'Prev page (-9)',
      accelerator: 'CmdOrCtrl+Left',
      click: () => { this.decrease () }
    }));
    submenu.append (new MenuItem({
      label: 'Next page (+9)',
      accelerator: 'CmdOrCtrl+Right',
      click: () => { this.increase () }
    }));
    submenu.append (new MenuItem({
      label: 'Print',
      accelerator: 'CmdOrCtrl+P',
      click: () => { this.print(false) }
    }));
    submenu.append (new MenuItem({
      label: 'Print and +9',
      accelerator: 'CmdOrCtrl+.',
      click: () => { this.print(true) }
    }));
    
    var printMenu = new MenuItem({label: 'Print', 'submenu': submenu});
    menu.append(printMenu);
    
    Menu.setApplicationMenu(menu);
  }

  componentDidMount () {
    this.loadPrinters ();
  }

  loadPrinters () {
    var printers =  electronRemote.getCurrentWindow().webContents.getPrinters();
    this.setState ({printers: printers});
    if (printers.length > 0)
      this.setState ({selectedPrinter: printers[0]});
  }

  render() {
    var tickets = [];

    for (let index = 0; index < 9; index++) {
      tickets.push(<Ticket key={index} number={index + this.state.number}/>);
    }

    var page = (<div className="page unselectable">
                  <div className="row">
                    {tickets}
                  </div>
                </div>);

    
    var printers = [];

    this.state.printers.forEach(printer => {
      printers.push(<div key={printer.name} className="dropdown-item" onClick={() => this.setState({selectedPrinter: printer})}>{printer.name}</div>);
    });
    
    var dropdown = (
      <div className="dropdown col-auto">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {this.state.selectedPrinter.name}
        </button>
        <div className="dropdown-menu unselectable" aria-labelledby="dropdownMenuButton">
          {printers}
        </div>
      </div>
    );

    return (
      <div className="container pt-4">
        <div className="row">
          <span className="col-auto px-2 unselectable text">Number:</span>
          <input type="number" max={MAX_NUMBER} min="1" placeholder="Number" value={this.state.number} className="col-2 input mx-2 text" onChange={(event) => this.setNumber (event)}/>
          <button onClick={() => this.increase ()} className="col-auto btn btn-primary mx-2">+9</button>
          
          <div className="col"></div>
          
          <span className="col-auto px-2 unselectable text">Printer:</span>
          {dropdown}
          <button onClick={() => this.print(false)} className="col-auto btn btn-warning mx-2">Print</button>
          <button onClick={() => this.print(true)} className="col-auto btn btn-success mx-2">Print and +9</button>
        </div>
        <div className="page-aspect-container mt-4">
          {page}
        </div>
        <Toast id="toast-success" title="Success!" body="Printed successfully!" color='green'/>
        <Toast id="toast-error" title="Error!" body={this.state.error} color='brown'/>
      </div>
    );
  }

  print(increase) {
    electronRemote.getCurrentWindow().webContents.print ({silent: true, printBackground: true, deviceName: this.state.selectedPrinter.name}
      , (success, errorType) => {
        if (!success) console.log(errorType)

        if(success) {
          $('#toast-success').toast({delay: 2000, animation: true}).toast('show');
        } else {
          this.setState({error: errorType});
          $('#toast-error').toast({delay: 2000}).toast('show');
        }

        if (increase) {
          this.setState ({number: this.state.number + 9})
          store.set('number', this.state.number + 9);
        } else {
          store.set('number', this.state.number);
        }
      });
  }

  increase () {
    this.setState ({number: this.state.number + 9})
      store.set('number', this.state.number + 9);
  }

  decrease () {
    this.setState ({number: this.state.number - 9})
      store.set('number', this.state.number - 9);
  }

  setNumber (event) {
    var number = parseInt(event.target.value);

    if (isNaN(number)) {
      number = 1;
    }

    if (number > MAX_NUMBER) {
      number = MAX_NUMBER;
    }
    if (number < 1) {
      number = 1;
    }
    
    this.setState({number: number});
  }

}