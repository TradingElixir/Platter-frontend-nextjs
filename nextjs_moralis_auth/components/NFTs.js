import axios from "axios";
import { useEffect } from "react";
import { Reload } from "@web3uikit/icons";
import { Input } from "@web3uikit/core"
import _ from 'lodash';
import React, { useState } from 'react';



function Nfts({ chain, wallet,  nfts, setNfts }) {
  const [nameFilter, setNameFilter] = useState("");
  const [idFilter, setIdFilter] = useState("");
  const [filteredNfts, setFilteredNfts] = useState([]);


  async function getUserNfts() {
    const response = await axios.get("http://localhost:5001/nftBalance", {
      params: {
        address: wallet,
        chain: chain,
      },
    });

    if (response.data.result) {
      nftProcessing(response.data.result);
    }
  }
  async function nftProcessing(t) {
    try {
      const processedNfts = await Promise.all(t.map(async (nft) => {
        let meta = JSON.parse(nft.metadata);
        if (meta && meta.image) {
          let imageUrl = meta.image;
          if (imageUrl.startsWith("ipfs://") || imageUrl.startsWith("https://gateway.pinata.cloud")) {
            imageUrl = "https://ipfs.moralis.io:2053/ipfs/" + imageUrl.replace("ipfs://", "").replace("https://gateway.pinata.cloud/ipfs/", "");
          } else if (imageUrl.startsWith("Qm")) {
            imageUrl = "https://ipfs.moralis.io:2053/ipfs/" + imageUrl;
          }
          try {
            const response = await axios.get(imageUrl);
            if (response.status === 200) {
              nft.image = imageUrl;
              return nft;
            }
          } catch (e) {
            console.log(e);
          }
        }
      }));
      const filteredNfts = processedNfts.filter((nft) => nft !== undefined);
      setNfts(filteredNfts);
      setFilteredNfts(filteredNfts);
    } catch (e) {
      console.log(e);
    }
  }
  
  

  useEffect(() => {
    if (idFilter === "" && nameFilter === "") {
      return setFilteredNfts(nfts);
    }

    let filNfts = [];

    for (let i = 0; i < nfts.length; i++) {
      if (
        nfts[i].name.toLowerCase().includes(nameFilter) &&
        idFilter.length === 0
      ) {
        filNfts.push(nfts[i]);
      } else if (
        nfts[i].token_id.includes(idFilter) &&
        nameFilter.length === 0
      ) {
        filNfts.push(nfts[i]);
      } else if (
        nfts[i].token_id.includes(idFilter) &&
        nfts[i].name.toLowerCase().includes(nameFilter)
      ) {
        filNfts.push(nfts[i]);
      }
    }

    setFilteredNfts(filNfts);
  }, [nameFilter, idFilter]);

  return (
    <>
      <div className="tabHeading">
        NFT Portfolio <Reload onClick={getUserNfts} />
      </div>
      <div className= "filters">
      <Input
          id="NameF"
          label="Name Filter"
          labelBgColor="rgb(0, 0, 55)"
          value={nameFilter}
          style={{}}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <Input
          id="IdF"
          label="Id Filter"
          labelBgColor="rgb(0, 0, 55)"
          value={idFilter}
          style={{}}
          onChange={(e) => setIdFilter(e.target.value)}
        />
        </div>
        <div className="nftList">
        {filteredNfts && filteredNfts.length > 0 &&

        
          filteredNfts.map((e) => {
            return (
              <>
                <div className="nftInfo">
                {e.image && <img src={e.image} width={230} />}
                
                <div>Name: {e.name}, </div>
                <div>(ID: {e.token_id.slice(0,5)})</div>
                </div>
              </>
            );
          })
          }
          </div>
      
    </>
  )};
        

export default Nfts;