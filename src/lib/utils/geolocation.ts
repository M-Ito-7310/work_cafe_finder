export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * ブラウザのGeolocation APIで現在地を取得
 * @returns 座標 {lat, lng}
 */
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1分以内のキャッシュを許可
      }
    );
  });
}

/**
 * 2点間の距離を計算（Haversine formula）
 * @param point1 座標1
 * @param point2 座標2
 * @returns 距離（km）
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // 地球の半径（km）
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * 位置情報を丸めて精度を下げる（プライバシー保護）
 * @param lat 緯度
 * @param lng 経度
 * @returns 丸めた座標
 */
export function roundCoordinates(lat: number, lng: number): Coordinates {
  return {
    lat: Math.round(lat * 1000) / 1000, // 小数点3桁まで（約111m精度）
    lng: Math.round(lng * 1000) / 1000,
  };
}
