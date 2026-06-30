import { Criteria, WargaDTO } from "./types";



export function calculateWP(
  wargaList: WargaDTO[],
  criteria: Criteria[]
){


  const data = wargaList.filter(
    item => item.status === "Sudah Dinilai"
  );


  if(data.length === 0){
    return [];
  }



  // total bobot

  const totalBobot =
    criteria.reduce(
      (sum,c)=>
      sum + Number(c.weight),
      0
    );




  // normalisasi bobot + cost negatif

  const bobotNormal:any = {};



  criteria.forEach(c=>{


    let weight =
    Number(c.weight)
    /
    totalBobot;



    if(c.type === "cost"){

      weight =
      weight * -1;

    }


    bobotNormal[c.code]=weight;


  });







  // hitung S

  const nilaiS = data.map(warga=>{


    let S = 1;



    criteria.forEach(c=>{


      const nilai =
      Number(
        warga.scores[c.code] || 1
      );



      S *= Math.pow(
        nilai,
        bobotNormal[c.code]
      );


    });




    return {

      id:warga.id,

      code:warga.code,

      nama:warga.nama,

      S

    };


  });





  const totalS =
    nilaiS.reduce(
      (sum,item)=>
      sum + item.S,
      0
    );






  // hitung nilai V


  return nilaiS


  .map(item=>{


    return {

      id:item.id,

      code:item.code,

      nama:item.nama,


      nilaiWP:
      Number(
        (item.S / totalS)
        .toFixed(4)
      )


    };


  })



  .sort(
    (a,b)=>
    b.nilaiWP-a.nilaiWP
  )



  .map(
    (item,index)=>({

      ...item,

      ranking:index+1

    })
  );

}