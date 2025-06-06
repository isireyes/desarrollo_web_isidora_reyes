document.getElementById("btn-portada").addEventListener("click", () => {
    window.location.href = "/";
});

fetch("/get-stats-data1")
  .then(res => res.json())
  .then(data => {
    const parsedData = data.map(item => {
      const [year, month, day] = item.date
      .split("-")
      .map((part) => parseInt(part, 10));
      return [
        Date.UTC(year, month - 1, day), 
        item.cantidad,
      ];
    });
    parsedData.sort((a, b) => a[0] - b[0]);
    const container = document.getElementById("grafico-lineas");
    container.innerHTML = "";
    

    Highcharts.chart("grafico-lineas", {
      chart: { type: "line" },
      title: { text: "Actividades por día" },
      xAxis: { type: "datetime" },
      yAxis: { title: { text: "Cantidad de actividades" }},
      tooltip: { shared: true },
      series: [{
        name: "Actividades",
        data: parsedData,
        color: "#FC2865"
      }]
    });
  });


  fetch("/get-stats-data2")
  .then(res => res.json())
  .then(data => {
    const parsedData = data.map(item => ({
      name: item.tipo,
      y: item.cantidad
    }));

    Highcharts.chart("grafico-torta", {
      chart: { type: "pie" },
      title: { text: "Actividades por tipo" },
      series: [{
        name: "Actividades",
        colorByPoint: true,
        data: data,
      }]
    });
  });

  fetch("http://127.0.0.1:5000/get-stats-data3")
  .then((response) => response.json())
  .then((data) => {
    Highcharts.chart("grafico-barras", {
      chart: {
        type: "column",
      },
      title: {
        text: "Actividades por franja horaria y mes",
      },
      xAxis: {
        categories: [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "Cantidad de Actividades",
        },
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        column: {
          grouping: true,
          shadow: false,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: "Mañana",
          data: data["mañana"],
        },
        {
          name: "Mediodía",
          data: data["mediodía"],
        },
        {
          name: "Tarde",
          data: data["tarde"],
        },
      ],
    });
  })
  .catch((error) => console.error("Error gráfico 3:", error));