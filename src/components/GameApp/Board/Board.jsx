import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import BoardSquare from "./BoardSquare";

const BoardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`
const Square = styled.div`
  width: 12.5%;
  height: 12.5%;
`

function Board({board, position}) {

    const [currentBoard, setCurrentBoard] = useState([])
    useEffect(() => {
        setCurrentBoard(
            position === 'w' ? board.flat() : board.flat().reverse()
        )
    }, [board, position])

    const getXYPosition = (i) => {
        const x = position === 'w'
            ? i % 8
            : Math.abs((i % 8) - 7)
        const y = position === 'w'
            ? Math.abs(Math.floor(i / 8) - 7)
            : Math.floor(i / 8)
        return {x, y}
    }

    const isBlack = (i) => {
        const {x, y} = getXYPosition(i)
        return (x + y) % 2 === 1
    }

    const getPosition = (i) => {
        const {x, y} = getXYPosition(i)
        const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x]
        return `${letter}${y + 1}`
    }

    return (
        <BoardWrapper>
            {currentBoard.flat().map((piece, i) => (
                <Square key={i}>
                    <BoardSquare piece={piece} black={isBlack(i)} position={getPosition(i)}/>
                </Square>
            ))}
        </BoardWrapper>
    );
}

export default Board;