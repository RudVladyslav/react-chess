import React, {useEffect, useState} from 'react';
import Piece from "./Piece";
import styled from "styled-components";
import {useDrop} from "react-dnd";
import {handleMove} from "./Game";
import {gameSubject} from "./Game";
import Promote from "./Promote";

const PieceWrapper = styled.div`
  background-color: ${props => props.black ? '#B59963' : '#F0D9B5'};
  width: 100%;
  height: 100%;
`

function Square({piece, black, position}) {
    const [promotion, setPromotion] = useState(null)
    const [, drop] = useDrop({
        accept: 'piece',
        drop: (item) => {
            const [fromPosition] = item.id.split('_')
            handleMove(fromPosition, position)
        }
    })

    useEffect(() => {
        const subscribe = gameSubject.subscribe(
            ({pendingPromotion}) =>
                pendingPromotion && pendingPromotion.to === position
                    ? setPromotion(pendingPromotion)
                    : setPromotion(null)
        )
        return () => subscribe.unsubscribe()
    }, [position])

    return (
        <PieceWrapper ref={drop}
                      black={black}>
            {promotion ?
                <Promote promotion = {promotion}/> : piece ? <Piece piece={piece} position={position}/> : null}
        </PieceWrapper>
    );
}

export default Square;