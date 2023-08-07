const bttn = document.querySelector("#bttnConverter");
const ctx = document.querySelector("#renderCanva");
let myChart; //debe ser let, const manda error

// tomar desde la api
const indicadoresHistoricosMoneda = async (coin2Change) => {
  try {
    const desdeAPI = await fetch(`https://mindicador.cl/api/${coin2Change}`);
    const dataMonetaria = await desdeAPI.json();
    console.log(dataMonetaria);
    return dataMonetaria.serie;
  } catch (error) {
    alert(error.message);
  }
};

// operatoria
const conversor = (montoOrigen, dataCoin) => {
  const actualValue = dataCoin[0].valor;
  const totales = montoOrigen / actualValue;
  return Math.round(totales * 100) / 100;
};

//modificar dom con resultado operatoria
const totalAmount = (totales) => {
  document.querySelector("#resultadoConversor").innerHTML = totales;
  document.querySelector("#monedaSeleccionada").innerHTML = coin2Change.value;
};

// desde aca vienen los "datos" //input de moneda elegida
const apiData = async (montoOrigen, coin2Change) => {
  const dataCoin = await indicadoresHistoricosMoneda(coin2Change);
  renderChart(dataCoin, montoOrigen);
};

// eje x, fechas de valores // y pasarlo a fecha normal especifica de zona
const dateValue = (dataCoin) => {
  return dataCoin.map((item) =>
    new Date(item.fecha).toLocaleDateString("es-CL")
  ); //desde array
};

// eje y, valores moneda
const coinValue = (dataCoin) => {
  return dataCoin.map((item) => item.valor); //desde array
};

//"borrar" grafico antes de renderizar otro

const erraseChart = () => {
  if (myChart) {
    myChart.destroy();
  }
};

// renderzar en el evento y todo lo relacionado con el grafico
let renderChart = (dataCoin, montoOrigen) => {
  // totales del conversor
  const totales = conversor(montoOrigen, dataCoin); //operatoria
  totalAmount(totales); //innerhtml

  // ejes de grafico
  const lables = dateValue(dataCoin).splice(0, 10).reverse();
  const values = coinValue(dataCoin).splice(0, 10);

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: lables,
      datasets: [
        {
          label: `grafica historica de valores de ` + coin2Change.value,
          data: values,
          backgroundColor: "rgba(245, 222, 179, 0.926)",
          borderColor: "rgba(245, 222, 179, 0.926)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 25,
            },
          },
        },
      },
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
};

bttn.addEventListener("click", async () => {
  //captura de datos
  const montoOrigen = document.getElementById("valorIngreso").value;
  const coin2Change = document.getElementById("coin2Change").value;

  if (!montoOrigen) {
    alert("Por favor, ingresar valores");
    return;
  }

  //HACER TODO LO ANTERIOR
  erraseChart();
  await apiData(montoOrigen, coin2Change);
});
