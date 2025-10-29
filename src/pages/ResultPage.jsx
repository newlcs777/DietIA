// 4. Salva avaliação física e redireciona ✅
const salvarAvaliacao = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Usuário não autenticado.");
    return;
  }

  try {
    await setDoc(
      doc(db, "physicalAssessments", user.uid),
      {
        age: age || 0,
        subescapular,
        triciptal,
        axiliar,
        supra,
        peitoral,
        abdominal,
        coxa,
        resultado,
        percentualGordura: percentualGordura ? percentualGordura.toFixed(2) : "0",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    await updateUserData({
      age: Number(age) || 0,
      percentualGordura: percentualGordura ? Number(percentualGordura.toFixed(2)) : 0,
      resultadoDobras: resultado || 0,
    });

    setMensagem("✅ Avaliação física salva e sincronizada!");

    // ✅ Redireciona para a ResultPage depois de 1 segundo
    setTimeout(() => {
      navigate("/ResultPage");
    }, 1000);
  } catch (err) {
    console.error("Erro ao salvar avaliação física:", err);
    setMensagem("❌ Erro ao salvar os dados.");
  }
};
