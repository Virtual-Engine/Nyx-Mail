const db = require('../database');

const UserModel = {
    async findUserByDiscordId(discordId) {
        try {
            // Exécution de la requête pour récupérer l'utilisateur
            const rows = await db.query('SELECT * FROM discord_users WHERE discord_id = ?', [discordId]);

            // Loguer le résultat de la requête
            console.log('Résultat de la requête:', rows);

            // Vérifier si rows est un tableau
            if (!Array.isArray(rows)) {
                console.error('Erreur: rows n\'est pas un tableau');
                return null;
            }

            // Vérifier si des utilisateurs ont été trouvés
            return rows.length > 0 ? rows[0] : null;

        } catch (error) {
            console.error('Erreur lors de la requête:', error);
            return null;
        }
    },

    async insertUser(userData) {
        const { id, username, discriminator, avatar, accessToken, refreshToken } = userData;
        await db.execute(
            'INSERT INTO discord_users (discord_id, username, discriminator, avatar, access_token, refresh_token) VALUES (?, ?, ?, ?, ?, ?)',
            [id, username, discriminator, avatar, accessToken, refreshToken]
        );
    },

    async updateTokens(discordId, accessToken, refreshToken) {
        await db.execute(
            'UPDATE discord_users SET access_token = ?, refresh_token = ? WHERE discord_id = ?',
            [accessToken, refreshToken, discordId]
        );
    }
};

module.exports = UserModel;