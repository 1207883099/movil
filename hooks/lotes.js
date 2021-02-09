export const generarLotes = async (dbMaestra, idSector) => {
  let collectionLote = [];

  dbMaestra.find({}, async function (err, dataMaestra) {
    err && Alert.alert(err.message);
    const result = dataMaestra[0].Lotes.filter(
      (item) => item.IdSector === idSector,
    );

    let item;
    for (let i = 0; i < result.length; i++) {
      item = result[i];
      collectionLote.push({
        IdLote: item.IdLote,
        Nombre: item.Nombre,
        value: 0,
      });
    }
  });
  return await collectionLote;
};
