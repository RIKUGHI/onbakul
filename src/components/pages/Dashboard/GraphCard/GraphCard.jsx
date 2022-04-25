// libraries
import Chart from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import { Component, createRef, useEffect, useRef } from 'react'

// styles
import './GraphCard.scss'

export default class GraphCard extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div className="graph-card">
        <h3>{this.props.title}</h3>
        {this.props.children}
      </div>
    )
  }
}
