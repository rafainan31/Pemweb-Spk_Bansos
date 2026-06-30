import { Criteria, WargaDTO } from "./types";


export function calculateSAW(
  wargaList: WargaDTO[],
  criteria: Criteria[]
) {


  const data = wargaList.filter(
    item => item.status === "Sudah Dinilai"
  );


  if(data.length === 0){
    return [];
  }



  // hitung total bobot
  const totalBobot =
    criteria.reduce(
      (sum,c)=>
      sum + Number(c.weight),
      0
    );



  const result = data.map(warga=>{


    let nilaiAkhir = 0;



    criteria.forEach(c=>{


      const nilai =
      Number(
        warga.scores[c.code] || 0
      );



      const semuaNilai =
      data.map(item=>
        Number(
          item.scores[c.code] || 0
        )
      );



      let normalisasi = 0;



      // BENEFIT

      if(c.type === "benefit"){


        normalisasi =
        nilai /
        Math.max(...semuaNilai);


      }



      // COST

      else{


        normalisasi =
        Math.min(...semuaNilai)
        /
        nilai;


      }



      // bobot dinormalisasi

      const bobot =
      Number(c.weight)
      /
      totalBobot;



      nilaiAkhir +=
      normalisasi *
      bobot;



    });





    return {

      id:warga.id,

      code:warga.code,

      nama:warga.nama,


      nilaiSAW:
      Number(
        nilaiAkhir.toFixed(4)
      )

    };


  });





  return result

  .sort(
    (a,b)=>
    b.nilaiSAW -
    a.nilaiSAW
  )


  .map(
    (item,index)=>({

      ...item,

      ranking:index+1

    })
  );


}