# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    config.vm.box = "ubuntu-trusty"
    config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"
    config.vm.network :private_network, ip: "192.168.50.100"

    # plugin conflict
    # if Vagrant.has_plugin?("vagrant-vbguest") then
    #     config.vbguest.auto_update = false
    # end

    config.vm.provider "virtualbox" do |v|
        v.name = "boiler"
        v.customize ["modifyvm", :id, "--memory", 2048]
    end

    config.vm.provision "shell",
        inline: $install_prereqs
    config.vm.provision "shell",
        inline: $install_node_git
    config.vm.provision "shell",
        inline: $start_api
end

# software-properties-common python-software-properties \
$install_prereqs = <<SCRIPT
apt-get install -y \
    redis-server mongodb \
    git make gcc g++
SCRIPT

$install_node_git = <<SCRIPT
apt-add-repository ppa:chris-lea/node.js-devel
apt-get update
apt-get install -y nodejs
ln -fs `which nodejs` /usr/local/bin/node
SCRIPT


$start_api = <<SCRIPT
cd /vagrant
cp /vagrant/deploy/upstart/vagrant.conf /etc/init/boiler.conf
mkdir -p log
npm install
./node_modules/bower/bin/bower --allow-root install
service boiler restart
SCRIPT
