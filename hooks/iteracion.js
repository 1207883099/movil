export const AddCeraIteracion = (iteracion) => {
  const CellCuadrilla = iteracion.substr(0, 4);
  const Int = iteracion.substr(4, iteracion.length - 4);

  switch (iteracion.length) {
    case 5:
      return `${CellCuadrilla}0000${Int}`;
    case 6:
      return (codigoZero = `${CellCuadrilla}000${Int}`);
    case 7:
      return `${CellCuadrilla}00${Int}`;
    case 8:
      return (codigoZero = `${CellCuadrilla}0${Int}`);
    default:
      return `${CellCuadrilla}${Int}`;
  }
};
