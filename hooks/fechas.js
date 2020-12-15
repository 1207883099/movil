export function get_Semana_Del_Ano() {
  let today = new Date();
  let Year,
    then,
    Month,
    Day,
    now,
    NumberOfWeek = null;
  Year = takeYear(today);
  Month = today.getMonth();
  Day = today.getDate();
  now = Date.UTC(Year, Month, Day + 1, 0, 0, 0);
  let Firstday = new Date();
  Firstday.setYear(Year);
  Firstday.setMonth(0);
  Firstday.setDate(1);
  then = Date.UTC(Year, 0, 1, 0, 0, 0);
  let Compensation = Firstday.getDay();
  if (Compensation > 3) {
    Compensation -= 4;
  } else {
    Compensation += 3;
  }
  NumberOfWeek = Math.round(((now - then) / 86400000 + Compensation) / 7);
  return NumberOfWeek;
}

function takeYear(theDate) {
  let x;
  x = theDate.getYear();
  let y = x % 100;
  y += y < 38 ? 2000 : 1900;
  return y;
}

export function getDia(date) {
  const dias = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];
  const numerDay = date.getDay();
  return dias[numerDay];
}

export function fecha_actual() {
  let ano = new Date().getFullYear();
  let mes = new Date().getMonth() + 1;
  let dia = new Date().getDate();

  if (mes < 10) {
    mes = `${0}${mes}`;
  }
  if (dia < 10) {
    dia = `${0}${dia}`;
  }

  return ano + '-' + mes + '-' + dia;
}

export function suma_resta_fecha(fecha, dias) {
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

export function primerDiaSemana() {
  const curr = new Date();
  const first = curr.getDate() - curr.getDay();
  return new Date(curr.setDate(first)).toUTCString();
}
