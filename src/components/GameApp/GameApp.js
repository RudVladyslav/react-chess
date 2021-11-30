import './App.css';
import {useEffect, useState} from "react";
import {gameSubject, initGame, resetGame} from "./Game";
import Board from "./Board";
import styled from "styled-components";
import {useHistory, useParams} from "react-router-dom";
import {db} from "./firebase";
import Preloader from "./components/Preloader/Preloader";

const GameContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(34, 34, 34);
`
const BoardContainer = styled.div`
  width: 600px;
  height: 600px;
`
const VerticalText = styled.h2`
  text-orientation: upright;
  writing-mode: vertical-lr;
  font-family: sans-serif;
  padding: 10px;
  color: white;
`

const Button = styled.button`
  margin-top: 20px;
  cursor: pointer;
  background-color: rgb(63, 63, 63);
  border: 2px solid white;
  border-radius: 10px;
`
const ShareGame = styled.div`
  position: absolute;
  width: 400px;
  bottom: 0;
  left: 0;
`


const GameApp = () => {
    const [board, setBoard] = useState([])
    const [isGameOver, setIsGameOver] = useState()
    const [result, setResult] = useState()
    const [initResult, setInitResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('waiting')
    const [position, setPosition] = useState()
    const [game, setGame] = useState({})
    const history = useHistory()
    const {id} = useParams()
    const sharebleLink = window.location.href

    useEffect(() => {
        let subscribe

        async function init() {
            const res = await initGame(id !== 'local' ? db.doc(`games/${id}`) : null)
            setInitResult(res)
            setLoading(false)
            if (!res) {
                subscribe = gameSubject.subscribe((game) => {
                    setBoard(game.board)
                    setIsGameOver(game.isGameOver)
                    setResult(game.result)
                    setPosition(game.position)
                    setStatus(game.status)
                    setGame(game)
                })
            }
        }

        init()

        return () => subscribe && subscribe.unsubscribe()
    }, [id])

    if (loading) {
        return <Preloader src={require('./assets/preloader.gif').default} text={''}/>
    }

    if (initResult === 'notfound') {
        return <Preloader src={require('./assets/error.gif').default} text={'Not found'}/>
    }
    if (initResult === 'intruder') {
        return <Preloader src={require('./assets/error.gif').default} text={'The game is already full'}/>
    }

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(sharebleLink)
    }

    console.log(game.oponent ,game.oponent)
    return (
        <GameContainer>
            {isGameOver && (
                <VerticalText>GAME OVER
                    <Button onClick={async () => {
                        await resetGame
                        history.push('/')
                    }}>
                        <VerticalText>NEW GAME </VerticalText>
                    </Button>
                </VerticalText>
            )
            }
            <BoardContainer>
                {game.oponent && game.oponent.name && <span className="tag is-link">{game.oponent.name}</span>}
                <Board board={board} position={position}/>
                {game.member && game.member.name && <span className="tag is-link">{game.member.name}</span>}
            </BoardContainer>
            {result && <VerticalText>{result}</VerticalText>}
            {status === 'waiting' && (<ShareGame className="notification is-link">
                <strong>Share this game to continue</strong>
                <br/>
                <br/>
                <div className="field has-addons">
                    <div className="control is-expanded">
                        <input type="text" className='input' readOnly value={sharebleLink}/>
                    </div>
                    <div className="control">
                        <button className="button is-info" onClick={copyToClipboard}>Copy</button>
                    </div>
                </div>
            </ShareGame>)}

        </GameContainer>
    );
}

export default GameApp;
