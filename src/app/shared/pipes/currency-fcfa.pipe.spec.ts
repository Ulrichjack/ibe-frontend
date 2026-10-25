import { CurrencyFcfaPipe } from './currency-fcfa.pipe';

describe('CurrencyFcfaPipe', () => {
  const pipe = new CurrencyFcfaPipe();
  it('annonce un tarif sur demande quand le prix manque', () => {
    expect(pipe.transform(null)).toBe('Tarif sur demande');
    expect(pipe.transform(undefined)).toBe('Tarif sur demande');
  });
  it('préserve un prix explicitement égal à zéro', () => {
    expect(pipe.transform(0)).toBe('0 FCFA');
  });
  it('formate les montants connus', () => {
    expect(pipe.transform(15000)).toBe('15 000 FCFA');
  });
});
