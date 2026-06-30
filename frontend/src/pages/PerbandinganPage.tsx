import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api, MetodeResult } from "../services/api";


export default function PerbandinganPage(){

const [saw,setSaw]=useState<MetodeResult[]>([]);
const [wp,setWp]=useState<MetodeResult[]>([]);
const [loading,setLoading]=useState(true);



useEffect(()=>{

loadData();

},[]);



async function loadData(){

try{

const [
sawData,
wpData

]=await Promise.all([

api.getSAW(),

api.getWP()

]);


setSaw(sawData);

setWp(wpData);


}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}

}




return(

<Layout

title="Perbandingan Metode SPK"

subtitle="Perbandingan hasil perhitungan TOPSIS, SAW, dan Weighted Product"

>


<div className="comparison-container">


<div className="hero-panel">

<h2>
Analisis Perbandingan Metode
</h2>

<p>
Hasil ranking penerima bantuan sosial
berdasarkan metode SPK.
</p>


</div>




<div className="comparison-grid">



{/* SAW */}

<div className="card glass-card">


<h3>
SAW
</h3>


<p>
Simple Additive Weighting
</p>



<table>

<thead>

<tr>

<th>
Rank
</th>

<th>
Nama
</th>

<th>
Nilai
</th>

</tr>


</thead>


<tbody>


{saw.map(item=>(


<tr key={item.id}>


<td>
{item.ranking}
</td>


<td>
{item.nama}
</td>


<td>
{item.nilaiSAW}
</td>


</tr>


))}


</tbody>


</table>


</div>







{/* WP */}


<div className="card glass-card">


<h3>
WP
</h3>


<p>
Weighted Product
</p>



<table>


<thead>


<tr>

<th>
Rank
</th>


<th>
Nama
</th>


<th>
Nilai
</th>


</tr>


</thead>


<tbody>


{wp.map(item=>(


<tr key={item.id}>


<td>
{item.ranking}
</td>


<td>
{item.nama}
</td>


<td>
{item.nilaiWP}
</td>


</tr>


))}



</tbody>


</table>



</div>



</div>



</div>


</Layout>


)

}