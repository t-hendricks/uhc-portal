export const mockNodes = {
  data: [
    {
      internal_ip: '10.0.139.97:9537',
      hostname: 'ip-10-0-139-97.us-west-2.compute.internal',
      up: 0,
      time: '1562168629557',
    },
    {
      internal_ip: '10.0.152.98',
      hostname: 'ip-10-0-133-185.ec2.internal',
      up: 0,
      time: '1562168629557',
    },
    {
      internal_ip: '10.0.143.198',
      hostname: 'ip-10-0-143-198.ec2.internal',
      up: 1,
      time: '1562168629557',
    },
  ],
};

export const mockAlerts = {
  data: [
    {
      name: 'KubeDeploymentReplicasMismatch',
      severity: 'warning',
    },
    {
      name: 'KubeDeploymentReplicasMismatch',
      severity: 'critical',
    },
    {
      name: 'KubeDeploymentReplicasMismatch',
      severity: 'warning',
    },
  ],
};
