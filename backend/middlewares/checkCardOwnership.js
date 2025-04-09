const Card = require("../models/card");
const { HttpStatus, HttpResponseMessage } = require("../enums/http");

const checkCardOwnership = async (req, res, next) => {
  try {
    debugger;
    const { cardId } = req.params;
    const userId = req.user.id;

    // Busca o card pelo ID
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: HttpResponseMessage.NOT_FOUND,
      });
    }

    // Verifica se o usuário logado é o proprietário do card
    if (card.owner.toString() !== userId) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: HttpResponseMessage.FORBIDDEN,
      });
    }

    next(); // Permite que a próxima função no ciclo de middleware seja executada
  } catch (error) {
    console.error("Erro na verificação de propriedade do card:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = checkCardOwnership;
