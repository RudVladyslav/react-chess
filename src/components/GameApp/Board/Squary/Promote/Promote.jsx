import React from 'react';
import styled from "styled-components";
import {move} from "./Game";

const BoardSquareWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`
const PromoteSquare = styled.div`
  width: 50%;
  height: 50%;
`
const PieceWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

`
const PieceImage = styled.img`
  max-height: 70%;
  max-width: 70%;
`

const promotionPieces = ['r', 'n', 'b', 'q']

function Promote({promotion: {from, to, color}}) {
    return (
        <BoardSquareWrapper>
            {promotionPieces.map((p, i) =>
                <PromoteSquare key={i}>
                        <PieceWrapper onClick={()=>move(from,to,p)}>
                            <PieceImage src={require(`./assets/${p}_${color}.png`).default}/>
                        </PieceWrapper>
                </PromoteSquare>
            )}
        </BoardSquareWrapper>
    );
}

export default Promote;