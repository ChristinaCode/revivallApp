
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';

import { supabase } from '@/lib/supabase';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Profile = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name: string;
  admin?: boolean | null;
};

type Donation = {
  don_id: string;
  user_id: string;
  amount: number;
  donor: string;
  date: string;
  forThePot: boolean;
  ems: boolean;
};

type MemberSummary = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name: string;
  totalRaised: number;
  potTotal: number;
  emsTotal: number;
};

export default function OverallFundraisingScreen() {
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadOverallFundraising();
  }, []);

  async function loadOverallFundraising() {
    setLoading(true);
    setErrorMessage('');

    // Get all member profiles.
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, firstName, lastName, admin')
      .order('firstName', { ascending: true });

    if (profileError) {
      console.error('Error loading profiles:', profileError);
      setErrorMessage('Could not load members.');
      setLoading(false);
      return;
    }

    // Get all donations across members.
    const { data: donations, error: donationError } = await supabase
      .from('donations')
      .select('don_id, user_id, amount, donor, date, forThePot, ems');

    if (donationError) {
      console.error('Error loading all donations:', donationError);
      setErrorMessage('Could not load donations.');
      setLoading(false);
      return;
    }

    const allProfiles = (profiles ?? []) as Profile[];
    const allDonations = (donations ?? []) as Donation[];

    // Calculate totals separately for each member.
    const summaries: MemberSummary[] = allProfiles
      .map((profile) => {
        const memberDonations = allDonations.filter(
          (donation) => donation.user_id === profile.id
        );

        return {
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          name: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || 'Unnamed Member',
          totalRaised: memberDonations.reduce(
            (total, donation) => total + Number(donation.amount ?? 0),
            0
          ),
          potTotal: memberDonations
            .filter((donation) => donation.forThePot)
            .reduce(
              (total, donation) => total + Number(donation.amount ?? 0),
              0
            ),
          emsTotal: memberDonations
            .filter((donation) => donation.ems)
            .reduce(
              (total, donation) => total + Number(donation.amount ?? 0),
              0
            ),
        };
      });

    setMembers(summaries);
    setLoading(false);
  }

  const totalRaised = members.reduce(
    (total, member) => total + member.totalRaised,
    0
  );

  const totalPot = members.reduce(
    (total, member) => total + member.potTotal,
    0
  );

  const totalEMS = members.reduce(
    (total, member) => total + member.emsTotal,
    0
  );

  function formatMoney(amount: number) {
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  let content;

  if (loading) {
    content = (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading fundraising information...</ThemedText>
      </View>
    );
  } else if (errorMessage) {
    content = (
      <View style={styles.centered}>
        <ThemedText>{errorMessage}</ThemedText>
      </View>
    );
  } else {
    content = (
      <>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <ThemedText style={styles.cardLabel}>
              Total Raised
            </ThemedText>
            <ThemedText type="subtitle">
              {formatMoney(totalRaised)}
            </ThemedText>
          </View>

          <View style={styles.summaryCard}>
            <ThemedText style={styles.cardLabel}>
              Total in Pot
            </ThemedText>
            <ThemedText type="subtitle">
              {formatMoney(totalPot)}
            </ThemedText>
          </View>

          <View style={styles.summaryCard}>
            <ThemedText style={styles.cardLabel}>
              Total EMS
            </ThemedText>
            <ThemedText type="subtitle">
              {formatMoney(totalEMS)}
            </ThemedText>
          </View>

          <View style={styles.summaryCard}>
            <ThemedText style={styles.cardLabel}>
              Members
            </ThemedText>
            <ThemedText type="subtitle">
              {members.length}
            </ThemedText>
          </View>
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Fundraising by Member
        </ThemedText>

        {members.length === 0 ? (
          <ThemedText>
            No members found.
          </ThemedText>
        ) : (
          members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <ThemedText type="subtitle">
                {member.name}
              </ThemedText>

              <View style={styles.memberRow}>
                <ThemedText>Total raised</ThemedText>
                <ThemedText>
                  {formatMoney(member.totalRaised)}
                </ThemedText>
              </View>

              <View style={styles.memberRow}>
                <ThemedText>Pot</ThemedText>
                <ThemedText>
                  {formatMoney(member.potTotal)}
                </ThemedText>
              </View>

              <View style={styles.memberRow}>
                <ThemedText>EMS</ThemedText>
                <ThemedText>
                  {formatMoney(member.emsTotal)}
                </ThemedText>
              </View>
            </View>
          ))
        )}
      </>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          Overall Fundraising
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Fundraising across all RevivALL members
        </ThemedText>

        {content}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  title: {
    marginBottom: 8,
    color: '#172B4D',
  },
  subtitle: {
    marginBottom: 24,
    opacity: 0.7,
    color: '#344054',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
    color: '#344054',
  },
  summaryCard: {
    width: '47%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    color: '#172B4D',
    backgroundColor: '#FFFFFF',
  },
  cardLabel: {
    opacity: 0.7,
    color: '#344054',
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#172B4D',
  },
  memberCard: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
});
