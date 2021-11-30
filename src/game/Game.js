import * as Chess from "../node_modules/chess.js/chess"
import {BehaviorSubject} from "rxjs";
import {auth} from "./firebase";
import {fromDocRef} from 'rxfire/firestore';
import {map} from "rxjs/operators";

let gameRef
let member

const chess = new Chess()

export let gameSubject = null

export const initGame = async (gameRefFb) => {
    debugger
    const {currentUser} = auth
    if (gameRefFb) {
        gameRef = gameRefFb
        const initialGame = await gameRefFb.get().then(doc => doc.data())
        if (!initialGame) {
            return 'notfound'
        }
        const creator = initialGame.members.find(m => m.creator === true)

        if (initialGame.status === 'waiting' && creator.uid !== currentUser.uid) {
            const currUser = {
                uid: currentUser.uid,
                name: localStorage.getItem('userName'),
                piece: creator.piece === 'w' ? 'b' : 'w'
            }
            const updateMembers = [...initialGame.members, currUser]
            await gameRefFb.update({members: updateMembers, status: 'ready'})
        } else if (!initialGame.members.map(m => m.uid).includes(currentUser.uid)) {
            return 'intruder'
        }
        chess.reset()
        gameSubject = fromDocRef(gameRefFb).pipe(
            map(gameDoc => {
                const game = gameDoc.data()
                const {pendingPromotion, gameData, ...restOfGame} = game
                member = game.members.find(m => m.uid === currentUser.uid)
                const oponent = game.members.find(m => m.uid !== currentUser.uid)

                if (gameData) {
                    chess.load(gameData)
                }
                const isGameOver = chess.game_over()
                return {
                    board: chess.board(),
                    pendingPromotion,
                    isGameOver,
                    position: member.piece,
                    member,
                    oponent,
                    result: isGameOver ? getGameResult() : null,
                    ...restOfGame
                }
            })
        )
    } else {
        gameRef = null
        gameSubject = new BehaviorSubject()
        const savedGame = localStorage.getItem('savedGame')
        if (savedGame) {
            chess.load(savedGame)
        }
        updateGame()
    }
}

export const resetGame = async () => {
    if (gameRef) {
        await updateGame(null, true,)
        chess.reset()
    } else {
        chess.reset()
        updateGame()
    }
}

export const handleMove = (from, to) => {
    const promotions = chess.moves({verbose: true}).filter(m => m.promotion)
    let pendingPromotion
    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        const pendingPromotion = {from, to, color: promotions[0].color}
        updateGame(pendingPromotion)
    }
    if (!pendingPromotion) {
        move(from, to)
    }
}

export const move = (from, to, promotion) => {
    let tempMove = {from, to}
    if (promotion) {
        tempMove.promotion = promotion
    }
    console.log({tempMove, member}, chess.turn())
    if (gameRef) {
        if (member.piece === chess.turn()) {
            const legalMove = chess.move(tempMove)
            if (legalMove) {
                updateGame()
            }
        }
    } else {
        const legalMove = chess.move(tempMove)
        if (legalMove) {
            updateGame()
        }
    }
}

const updateGame = async (pendingPromotion, reset) => {
    const isGameOver = chess.game_over()
    if (gameRef) {
        const updateData = {gameData: chess.fen(), pendingPromotion: pendingPromotion || null}
        if (reset){
            updateData.status = 'over'
        }
        await gameRef.update(updateData)
    } else {
        const newGame = {
            board: chess.board(),
            pendingPromotion,
            isGameOver,
            turn: chess.turn(),
            result: isGameOver ? getGameResult() : null
        }
        localStorage.setItem('savedGame', chess.fen())
        gameSubject.next(newGame)
    }


}

const getGameResult = () => {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === 'w' ? 'BLACK' : 'WHITE'
        return `CHECKMATE - WINNER - ${winner}`
    } else if (chess.in_draw()) {
        let reason = '50 - MOVES -RULE'
        if (chess.in_stalemate()) {
            reason = 'STALEMATE'
        } else if (chess.in_threefold_repetition()) {
            reason = 'REPETITION'
        } else if (chess.insufficient_material()) {
            reason = 'INSUFFICIENT MATERIAL'
        }
        return `DRAW - ${reason}`
    } else {
        return 'UNKNOWN REASON'
    }
}