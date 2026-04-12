import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLoyalty } from '../context/LoyaltyContext'
import { useNotification } from '../context/NotificationContext'
import { Star, Gift, TrendingUp, Clock, ArrowLeft, Crown, Check } from 'lucide-react'

export default function Loyalty() {
  const { user, isAuthenticated } = useAuth()
  const { data, rewards, transactions, redeemPoints, getTierInfo, getPointsValue } = useLoyalty()
  const { success, error } = useNotification()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Programme Fidélité</h2>
          <p className="text-gray-600 mb-6">
            Connectez-vous pour accéder à votre compte fidélité et gagner des points.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  const tierInfo = data ? getTierInfo(data.tier) : null

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (!data || data.points < reward.pointsCost) {
      error('Points insuffisants', `Il vous faut ${reward.pointsCost} points`)
      return
    }

    const successRedeem = redeemPoints(reward.pointsCost, `Échange: ${reward.name}`)
    if (successRedeem) {
      success('Récompense échangée !', reward.name)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Programme Fidélité</h1>
          <p className="text-gray-600 mt-2">Gagnez des points à chaque achat et échangez-les contre des récompenses</p>
        </div>

        {/* Status Card */}
        {data && tierInfo && (
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-6 text-white mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-green-200 text-sm">Niveau actuel</p>
                <div className="flex items-center gap-2 mt-1">
                  <Crown className="w-6 h-6 text-yellow-300" />
                  <h2 className="text-2xl font-bold">{tierInfo.name}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-200 text-sm">Points disponibles</p>
                <p className="text-4xl font-bold">{data.points}</p>
                <p className="text-green-200 text-sm">≈ {getPointsValue(data.points).toLocaleString()} FCFA</p>
              </div>
            </div>

            {/* Progress to next tier */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression</span>
                <span>{data.totalPointsEarned - data.totalPointsRedeemed} points</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min(100, ((data.totalPointsEarned - data.totalPointsRedeemed) / 10000) * 100)}%` 
                  }}
                />
              </div>
              <p className="text-green-200 text-xs mt-2">
                {data.tier === 'diamond' 
                  ? 'Vous êtes au niveau maximum !' 
                  : `Encore ${10000 - (data.totalPointsEarned - data.totalPointsRedeemed)} points pour Diamant`}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{data.totalPointsEarned}</p>
                <p className="text-green-200 text-sm">Points gagnés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{data.totalPointsRedeemed}</p>
                <p className="text-green-200 text-sm">Points échangés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{Math.round(data.totalSpent / 1000)}k</p>
                <p className="text-green-200 text-sm">FCFA dépensés</p>
              </div>
            </div>
          </div>
        )}

        {/* Tiers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Niveaux de fidélité</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['bronze', 'silver', 'gold', 'diamond'] as const).map(tier => {
              const info = getTierInfo(tier)
              const isCurrentTier = data?.tier === tier
              return (
                <div 
                  key={tier}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isCurrentTier 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${info.color}`}>
                    <Crown className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{info.name}</h4>
                  <p className="text-sm text-gray-500">{info.minPoints}+ points</p>
                  {isCurrentTier && (
                    <span className="inline-block mt-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      Actuel
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Récompenses disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map(reward => {
              const canAfford = data && data.points >= reward.pointsCost
              return (
                <div 
                  key={reward.id}
                  className={`p-4 rounded-xl border transition-all ${
                    canAfford ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <Gift className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                        <p className="text-sm text-gray-500">{reward.description}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-green-600">{reward.pointsCost}</span>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      canAfford
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Échanger' : `${reward.pointsCost - (data?.points || 0)} points manquants`}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Historique des points</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune transaction pour le moment</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map(txn => (
                <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {txn.type === 'earned' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <Gift className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{txn.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(txn.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${txn.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'earned' ? '+' : ''}{txn.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
