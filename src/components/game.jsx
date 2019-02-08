import React, {Component} from 'react';
import _ from 'lodash'
import {Card} from "./card";
import uuid from 'uuid'


const VALS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const SUITS = ['D', 'H', 'S', 'C'];


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// при образовании пары прибавляется число нераскрытых пар, умноженное на 42;
// при несовпадении пары вычитается число раскрытых пар, умноженное на 42.


export class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {gameStage: 1, cards: this.getCards(), openedCard: undefined, points: 0, locked: true, matchedPairs: 0}
    }

    closeCards = function () {
        this.setState(prevState => ({cards: prevState.cards.map(card => {return {...card, isOpen: false}}), locked: false}))
    };

    getCards(){
        let cards = [];
        for (let i = 0; i < 9; i++) {
            let rand_value = Math.floor(Math.random() * VALS.length);
            let rand_suit = Math.floor(Math.random() * SUITS.length);
            cards.push({value: VALS[rand_value], suit: SUITS[rand_suit], isOpen: true, id: uuid(), isMatched: false});
            cards.push({value: VALS[rand_value], suit: SUITS[rand_suit], isOpen: true, id: uuid(), isMatched: false})
        }
        cards = shuffle(cards);
        return cards
    }


    startNewGame = function () {
        this.setState({gameStage: 1, cards: this.getCards(), locked: false, points: 0});
        setTimeout(() => this.closeCards(), 5000);
    }.bind(this);;


    onCardClick = function (e, card) {

        if (this.state.locked || card.isMatched) {
            return
        }

        let cards = this.state.cards;
        let points = this.state.points;
        const clickedCardIndex = _.findIndex(cards, {id: card.id});
        if (!card.isOpen) {

            if (this.state.openedCard) {
                cards[clickedCardIndex] = {...card, isOpen: true};
                const openedCardIndex = _.findIndex(cards, {id: this.state.openedCard.id});

                this.setState({locked: true, cards: cards}, function () {
                    if (_.isEqual({value: this.state.openedCard.value, suit: this.state.openedCard.suit},
                        {value: card.value, suit: card.suit}) && this.state.openedCard.id != card.id) {
                        cards[openedCardIndex] = {...this.state.openedCard, isMatched: true};
                        cards[clickedCardIndex] = {...card, isMatched: true};

                        setTimeout(() => {
                                this.setState(prevState => ({
                                    gameStage: prevState.matchedPairs == 8 ? 2 : 1,
                                    openedCard: null,
                                    cards: cards,
                                    locked: prevState.matchedPairs == 8 ? true : false,
                                    points: prevState.points + (9 - prevState.matchedPairs) * 42,
                                    matchedPairs: prevState.matchedPairs + 1
                                }))
                            }
                            , 1000);
                    } else {
                        cards[openedCardIndex] = {...this.state.openedCard, isOpen: false};
                        cards[clickedCardIndex] = {...card, isOpen: false};


                        setTimeout(() => this.setState(prevState=> ({cards: cards, locked: false, openedCard: undefined, points: prevState.points - (9-prevState.matchedPairs)*42})), 1500);
                    }
                });

            } else {
                const clickedCardIndex = _.findIndex(cards, {id: card.id});
                cards[clickedCardIndex] = {...card, isOpen: true};
                this.setState({cards: cards, openedCard: card});
            }
        }
    }.bind(this);

    componentDidMount() {
        setTimeout(() => this.closeCards(), 5000);
    }

    render() {
        return (
            <div className="table__wrapper">
                <h2 className='points'>{this.state.points}</h2>
            <div className='table'>
                {this.state.gameStage == 2 && <button className={'btn__new_game'} onClick={this.startNewGame}>New Game</button>}
                {this.state.gameStage == 1 && this.state.cards.map(card => <Card key={card.id} card={card} onCardClick={this.onCardClick}/>)}
            </div>
            </div>
        )
    }

}