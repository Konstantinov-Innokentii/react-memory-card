import React, { Component } from 'react';
import back from './img/Back.png'

export class Card extends Component{

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.card.isOpen != this.props.card.isOpen || nextProps.card.isMatched != this.props.card.isMatched
    }

    render() {
        const image = require(`./img/${this.props.card.value+this.props.card.suit}.png`);

        return (
            <div className={this.props.card.isMatched ? "card-matched" : "card" } onClick={e => this.props.onCardClick(e, this.props.card)}>
                {this.props.card.isOpen && <>
                    <img src={image} alt={`${this.props.card.value+this.props.card.suit}`}/>
                </>}
                {
                    !this.props.card.isOpen &&
                    <img src={back} alt='card back'/>
                }
            </div>
        )
    }

}