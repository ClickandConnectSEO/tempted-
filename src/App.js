import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import Purchases from 'react-native-purchases';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [offerings, setOfferings] = useState(null);
  const [tier, setTier] = useState('free');

  useEffect(() => {
    (async () => {
      try {
        const key = process.env.RC_PUBLIC_SDK_KEY || 'replace_me';
        if (!key || key === 'replace_me') {
          console.log('Set RC_PUBLIC_SDK_KEY in EAS secrets for production build');
        } else {
          await Purchases.configure({ apiKey: key });
          const offs = await Purchases.getOfferings();
          setOfferings(offs);
        }
      } catch (e) {
        console.log('Purchases init error', e);
      }
    })();
  }, []);

  const signUp = async () => {
    setUser({ email });
    Alert.alert('Signed in', email);
  };

  const buy = async (pkg) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const ent = customerInfo.entitlements.active || {};
      if (ent.ent_platinum) setTier('platinum');
      else if (ent.ent_gold) setTier('gold');
      else setTier('free');
      Alert.alert('Thanks!', 'Purchase complete.');
    } catch (e) {
      Alert.alert('Error', e.message || 'Purchase cancelled');
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Tempted</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginTop: 12, padding: 8 }} />
        <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, marginTop: 12, padding: 8 }} />
        <View style={{ marginTop: 12 }}><Button title="Continue" onPress={signUp} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ padding: 24 }}>
      <Text style={{ fontSize: 18 }}>Welcome, {user.email}</Text>
      <Text style={{ marginTop: 8 }}>Tier: {tier.toUpperCase()}</Text>
      <ScrollView style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Subscriptions</Text>
        {offerings?.current?.availablePackages?.map((p) => (
          <View key={p.identifier} style={{ borderWidth: 1, padding: 12, marginBottom: 8 }}>
            <Text>{p.product.title}</Text>
            <Text>{p.product.priceString}</Text>
            <Button title="Buy" onPress={() => buy(p)} />
          </View>
        )) || <Text>Add RevenueCat offerings to see packages.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}
