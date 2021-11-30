import React from 'react';
import styled from "styled-components";
import {useDrag, DragPreviewImage} from "react-dnd";

const PieceContainer = styled.div`
  cursor: grab;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.isDragging ? '0' : '1'};
`
const PieceImage = styled.img`
  max-height: 70%;
  max-width: 70%;
`

function Piece({piece: {type, color}, position}) {
    const [{isDragging}, drag, preview] = useDrag({
        type: 'piece',
        item: {id: `${position}_${type}_${color}`},
        collect: (monitor) => {
            return {isDragging: !!monitor.isDragging()}
        },
    })
    const pieceImg = require(`./assets/${type}_${color}.png`).default
    return (
        <>
            <DragPreviewImage connect={preview} src={pieceImg}/>
            <PieceContainer ref={drag} isDragging={isDragging}>
                <PieceImage src={pieceImg}/>
            </PieceContainer>
        </>
    );
}

export default Piece;